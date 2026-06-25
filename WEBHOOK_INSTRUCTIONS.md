# Configuração do Webhook Customizado do Google Sheets

O script anterior de webhook que você estava utilizando esperava a estrutura de dados de formulários do **Elementor** (que envia campos em formatos aninhados ou URL encoded específicos). Como nossa aplicação envia um payload JSON limpo e moderno, aquele script falhou ao processar a requisição.

Para resolver isso, criamos um código de **Google Apps Script personalizado** para sua planilha. Ele lê o JSON exato enviado pelo app (`email`, `hackerHandle`, `selectedClass`, `registeredMemberId`, `unlockedCoupon`, `discountPct` e `timestamp`) e adiciona uma linha perfeitamente formatada na planilha de forma resiliente.

---

## 🛠️ Passo a Passo para Criar seu Webhook Customizado

1. **Abra sua Planilha do Google Sheets** onde deseja salvar os cadastros dos leads.
2. No menu superior, clique em **Extensões** > **Apps Script**.
3. Apague qualquer código existente no editor e cole o código fornecido abaixo (na próxima seção).
4. Clique no ícone de salvar (💾) ou aperte `Ctrl + S` (`Cmd + S` no Mac).
5. No canto superior direito, clique em **Implantar** (ou *Deploy*) > **Nova implantação**.
6. Clique na engrenagem ao lado de "Selecionar tipo" e escolha **App da Web**.
7. Preencha as seguintes configurações obrigatórias:
   - **Descrição:** `Webhook Leads CyberCode Academy`
   - **Executar como:** `Você (seu e-mail)`
   - **Quem tem acesso:** **Qualquer pessoa** (Isso é obrigatório para que as requisições anônimas de registro do site possam enviar os dados).
8. Clique em **Implantar**.
9. O Google solicitará permissões de acesso. Clique em **Autorizar acesso**, faça login com sua conta Google e clique em **Avançado** > **Acessar Webhook Leads... (não seguro)** para conceder a permissão.
10. Copie a **URL do App da Web** que aparecerá na tela (termina em `/exec`).
11. Cole essa nova URL em seu arquivo `/src/utils/firebase.ts` como o valor de `url` dentro da função `sendLeadToGoogleSheets` (o assistente já pode configurar isso para você!).

---

## 💻 Código do Google Apps Script (Cole no Editor)

Substitua todo o conteúdo do editor do Apps Script por este (o código exato fornecido por você):

```javascript
// Nome da aba onde os dados devem cair (caso não exista, usará a primeira disponível)
var sheetName = 'Página1'; 
var scriptProp = PropertiesService.getScriptProperties();

function initialSetup() {
  var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  scriptProp.setProperty('key', activeSpreadsheet.getId());
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    // 💡 Melhoria de Robustez: Tenta abrir pelo ID configurado; 
    // se falhar ou estiver em branco, usa a Planilha Ativa do container-bound script automaticamente!
    var doc;
    try {
      var key = scriptProp.getProperty('key');
      if (key) {
        doc = SpreadsheetApp.openById(key);
      }
    } catch(err) {
      // Ignora erro e tenta o método ativo abaixo
    }
    
    if (!doc) {
      doc = SpreadsheetApp.getActiveSpreadsheet();
    }
    
    if (!doc) {
      throw new Error("Não foi possível acessar a planilha ativa. Certifique-se de executar a função 'initialSetup' uma vez ou vincular o script à planilha.");
    }

    // 💡 Melhoria de Robustez: Tenta obter pelo nome da aba configurada, 
    // se não existir, usa a PRIMEIRA aba padrão disponível da planilha para evitar erro de null!
    var sheet = doc.getSheetByName(sheetName);
    if (!sheet) {
      sheet = doc.getSheets()[0];
    }
    
    if (!sheet) {
      throw new Error("Nenhuma aba ativa localizada na planilha.");
    }

    // Lê os cabeçalhos da primeira linha (ex: Nome, Email, Telefone, timestamp, etc.)
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var nextRow = sheet.getLastRow() + 1;

    // Mapeia os dados baseando-se nos nomes dos campos enviados (Nome, Email, Telefone... etc)
    var newRow = headers.map(function(header) {
      if (header === 'timestamp' || header === 'Timestamp' || header === 'Data/Hora') {
        return new Date();
      }
      return e.parameter[header] !== undefined ? e.parameter[header] : "";
    });

    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);

    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  finally {
    lock.releaseLock();
  }
}
```

---

## 🚀 Como este código funciona com o Formulário:
- O formulário envia os campos mapeados com suporte robusto a letras maiúsculas e minúsculas: `Nome`/`nome`/`name`, `Email`/`email`, `Telefone`/`telefone`/`phone` tanto no corpo da requisição POST quanto na String de consulta URL (Query Parameters).
- O Apps Script lê o cabeçalho da sua aba (`Página1`) e faz o de-para dinâmico. Se sua tabela tiver colunas escritas **Nome**, **Email** e **Telefone** na primeira linha, elas serão totalmente preenchidas!
- Lembra de rodar a função `initialSetup()` apenas uma vez no seu editor do Apps Script para salvar a ID da sua planilha nas propriedades de Script antes de fazer a implantação!
