# WhatsApp Official API - Vercel Production Setup

Este projeto está pronto para ser hospedado na Vercel como uma API serverless, utilizando o token oficial da Meta para integração com o WhatsApp Business Cloud API.

## Estrutura do Projeto

- `api/index.js`: Handler Express para rotas `/webhook` e `/` (compatível com Vercel)
- `server.js`: Versão local (não usada em produção Vercel)
- `.env`: Variáveis de ambiente (NÃO subir para o repositório público)

## Deploy na Vercel

1. Faça login em https://vercel.com/ e importe este repositório.
2. Certifique-se de que o diretório `api/` está presente na raiz do projeto.
3. No painel da Vercel, vá em **Settings > Environment Variables** e configure:
   - `WEBHOOK_VERIFY_TOKEN`: Token de verificação do webhook (use o mesmo cadastrado no painel Meta)
   - `GRAPH_API_TOKEN`: Token oficial da Meta (NUNCA exponha este valor em logs)
   - `N8N_WEBHOOK_URL`: (opcional) URL para encaminhar payloads recebidos
4. Deploy! A Vercel irá expor uma URL do tipo `https://<project>.vercel.app/webhook` para configurar no painel da Meta.

## Configurando o Webhook na Meta

1. No painel do app em https://developers.facebook.com/:
   - Vá em **WhatsApp > Configuration > Webhooks**
   - Adicione a URL gerada pela Vercel com `/webhook` ao final
   - Use o mesmo valor de `WEBHOOK_VERIFY_TOKEN` para verificação
   - Selecione o campo **messages**
2. Pronto! Seu endpoint está pronto para receber eventos do WhatsApp Cloud API.

## Segurança
- Nunca exponha ou logue tokens sensíveis.
- Assegure que apenas URLs HTTPS sejam usadas em produção.

## Desenvolvimento Local
- Use `server.js` para testes locais, rodando `npm install` e `npm start`.
- Em produção (Vercel), apenas `api/index.js` será usado.

## Dúvidas?
Consulte a documentação oficial:
- [Webhook set up guide](https://developers.facebook.com/docs/whatsapp/cloud-api/guides/set-up-webhooks)
- [WhatsApp Business Platform Documentation](https://developers.facebook.com/docs/whatsapp/)

## Additional Resources

Interested in learning more about the WhatsApp Platform?

Check out these resources:

- [**Webhook set up guide**](https://developers.facebook.com/docs/whatsapp/getting-started/signing-up/#configure-webhooks): The walkthrough for the code in this project.

- [**Quick start tutorial**](https://developers.facebook.com/docs/whatsapp/getting-started/signing-up/): Build your first app by remixing this project and following our quick start tutorial.

- [**WhatsApp Business Platform Documentation**](https://developers.facebook.com/docs/whatsapp/)


## Environment Setup

1. Create an account on Glitch to have access to all features mentioned here.
2. Remix this project on Glitch.
3. Click on the file `.env` on the left sidebar, and set these environment variables

- `WEBHOOK_VERIFY_TOKEN`: You can use any string and use the same when setting up the webhook in your app in the following steps.
- `GRAPH_API_TOKEN`: You can get a **Temporary access token** from the dashboard of your app on **Meta for Developers** when you click **API Setup** under the **WhatsApp** section on the left navigation pane.

4. Get the new Glitch URL to use as your webhook, eg: `https://project-name.glitch.me/webhook`. You can find the base URL by clicking on **Share** on top right in Glitch, copy the **Live Site** URL, then add `/webhook` to it.
5. Subscribe the webhook URL in the dashboard of your app on **Meta for Developers**. Click the **Configuration** menu under **WhatsApp** in the left navigation pane.
   In the **Webhook** section, click **Edit** and paste your webhook URL from the previous step. For the **Verify token** field, use the `VERIFY_TOKEN` value in your .env file, then click **Verify and save**.
   Under the **Webhook fields** section click **Manage** and make sure **messages** field is selected.
6. Edit `server.js` to change the webhook logic as needed.
7. Click on the **Logs** tab at the bottom to view server logs. The logs section also has a button to attach a debugger via Chrome devtools.
