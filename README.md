# Vereda

Aplicativo pessoal de acompanhamento de leitura das escrituras em português. Expo SDK 51, React Native 0.74.5, React 18.2, TypeScript e Expo Router. Sem login, backend, assinatura ou limite de leituras.

## Versão 1.1 — uma vereda iluminada

O símbolo agora é um caminho dourado guiado por um livro de escrituras iluminado, sobre azul profundo. SVGs editáveis e PNGs estão em `assets/images`; o mesmo desenho é usado no app, no ícone e na splash.

- Leitura integrada em uma janela sobre a lição, plano ou biblioteca: exibe o site oficial, com carregamento, tentativa novamente e alternativa no navegador. Requer internet; não baixa nem redistribui o texto completo.
- Os sons autorais de acerto, nova tentativa e conclusão estão em `assets/sounds`. Podem ser desligados na aba Progresso. São curtos, não pedem microfone e param quando o app vai para segundo plano.
- Novos módulos nativos: `expo-av ~14.0.7` e `react-native-webview 13.8.6`, conforme a tabela de dependências do SDK 51 instalado. **Requer novo APK/development build** para habilitar sons e WebView. O build antigo usa a janela do navegador e permanece sem som.
- Para gerar um APK completo: `git pull --ff-only`, depois `.\Atualizar.ps1 -Apk` no PowerShell. O EAS pode solicitar login; o APK sai pelo link do build, sem depender do PC para abrir.
- A WebView mantém a fonte oficial visível e limita a navegação incorporada às páginas das escrituras. Login e outras páginas devem ser abertos no navegador; não há sincronização de contas.

A leitura incorporada e o áudio foram verificados em testes com módulos nativos simulados e exportação Android. O comportamento real do site, do áudio e do build nativo ainda deve ser conferido no aparelho.

## Estado atual

- Jornada Fundamentos com seis lições autorais: fé, luz, amor, serviço, sabedoria e caridade.
- Duas perguntas por lição, explicações e novas tentativas sem penalidade.
- 30 XP na primeira conclusão; revisões mantêm a sequência e contam para a meta, sem repetir XP.
- Metas de 1, 2 ou 3 lições distintas por dia, calendário de estudo, níveis e cinco conquistas.
- Reflexões pessoais salvas automaticamente e reunidas no diário da aba Progresso.
- Planos de leitura com progresso local e links para o capítulo no site oficial.
- Aba Escrituras com acesso às cinco coleções da Biblioteca do Evangelho.
- Lembrete local às 19h e compartilhamento de um resumo de progresso.
- Identidade própria em verde, creme e dourado; ilustração vetorial original de um caminho que nasce de um livro.
- **Não é um leitor offline integral.** Lições, perguntas e reflexões funcionam offline, mas o texto completo é exibido a partir do serviço oficial. A edição bíblica exibida é a da fonte externa.
- Sem sincronização com a conta da Igreja. Não foi encontrada uma integração pública documentada para autenticação e sincronização de progresso de terceiros.
- O ícone e a splash novos aparecem no próximo build nativo. As telas mudam ao atualizar o JavaScript.

## Conteúdo e referências

O Vereda é independente, inspirado em estudo diário e aprendizagem por prática. Não inclui código nem assets extraídos de Tether ou Duolingo. Resumos e perguntas são autorais; não substituem o texto das escrituras.

Fontes das seis lições: Alma 32:21–43, Mateus 5:13–16, 1 Coríntios 13, Mosias 2:17–19, Tiago 1:5–6 e Morôni 7:45–48. Cada lição abre seu capítulo em português no site oficial.

A ligação para a Biblioteca do Evangelho segue a [documentação oficial de links](https://www.churchofjesuschrist.org/learn/mobile-applications/deep-linking-in-gospel-library?lang=eng). O sistema do aparelho decide se abre no navegador ou no aplicativo instalado. Entrar no site oficial não conecta a conta ao Vereda.

## Primeira instalação no Windows (PowerShell)

Tenha Git e Node.js instalados (CI usa Node 22). Use uma pasta nova, mantendo a pasta antiga como backup.

```powershell
Set-Location 'C:\Users\Dell'
git clone https://github.com/gderich/vereda.git vereda
Set-Location .\vereda
npm ci
npm run typecheck
npm test
npm run start:dev -- --clear
```

Abra no development build pelo QR Code. Expo Go atual não deve ser presumido compatível com SDK 51. Se surgirem erros de módulos nativos, gere um development build deste mesmo código.

## Atualizações seguintes

Na pasta clonada, execute:

```powershell
Set-Location 'C:\Users\Dell\vereda'
.\Atualizar.ps1
```

O script usa `git pull --ff-only`, instala o lockfile e inicia o Metro. Ele interrompe se houver alterações locais, preservando seu trabalho. Mudanças no GitHub não substituem automaticamente arquivos de uma pasta antiga que não foi clonada.

## APK que abre sem PC

O perfil `preview` está configurado como APK release sem development client:

```powershell
npx eas-cli build --platform android --profile preview
```

Autentique-se na sua conta EAS quando solicitado. O projeto continua associado ao ID EAS fornecido no arquivo original. Baixe o APK pelo link retornado ao concluir. Não publique senhas, tokens ou keystores no repositório.

Em caso de falha, abra o build, expanda **Run gradlew** e obtenha o trecho **What went wrong** e as linhas anteriores. Nenhuma causa de Gradle foi confirmada porque o ZIP não trouxe esses logs.

Para development build:

```powershell
npx eas-cli build --platform android --profile development
```

## Validação

```powershell
npm run typecheck
npm test
npx expo export --platform android --output-dir dist-check
```

Os testes incluem regras de progresso, compatibilidade com perfis antigos, renderização de telas e fluxo de uma lição com tentativa incorreta, reflexão e recompensa. Os testes de interface usam adaptadores simulados para módulos nativos; precisam ser complementados pela verificação em um aparelho.

GitHub Actions executa os mesmos checks a cada push. Não publica APK automaticamente nem usa credenciais EAS. Não há configuração de OTA neste projeto.

## Correções desta revisão

Importação e implementação da tela inicial; rota `index` em minúsculas; remoção da rota premium inexistente; React Compiler desativado; Metro SVG configurado para Expo; splash e hidratação de armazenamento; comentário JSX que virava texto solto; início de planos; seleção de capítulos limitada ao plano; planos temáticos corrigidos; prevenção de recompensas repetidas; nível calculado a partir do XP; datas locais para a sequência; notificações locais sem token push; remoção de dados de submissão de terceiros no EAS.

As chaves de armazenamento anteriores foram preservadas para não apagar progresso. A desinstalação do aplicativo pode apagar dados locais.
