# Vereda

Aplicativo pessoal de acompanhamento de leitura das escrituras em português. Expo SDK 51, React Native 0.74.5, React 18.2, TypeScript e Expo Router. Sem login, backend, assinatura ou limite de leituras.

## Estado atual

- Início com XP, nível, sequência de dias e plano ativo.
- Planos com capítulos específicos e progresso persistido no aparelho.
- Registro de leitura feita no seu exemplar; recompensas sem duplicar a mesma conclusão dentro de um plano.
- Lembrete local diário às 19h, ativado pelo usuário.
- **O ZIP original não contém os textos da Bíblia nem do Livro de Mórmon.** Esta versão não é ainda um leitor offline integral. Os versículos fictícios foram removidos; a interface informa essa limitação. A inclusão dos textos exige uma fonte e edição autorizadas.
- APK final e compatibilidade de todos os módulos nativos ainda precisam de teste no aparelho. A exportação JS não substitui o build Gradle.

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

GitHub Actions executa os mesmos checks a cada push. Não publica APK automaticamente nem usa credenciais EAS. Não há configuração de OTA neste projeto.

## Correções desta revisão

Importação e implementação da tela inicial; rota `index` em minúsculas; remoção da rota premium inexistente; React Compiler desativado; Metro SVG configurado para Expo; splash e hidratação de armazenamento; comentário JSX que virava texto solto; início de planos; seleção de capítulos limitada ao plano; planos temáticos corrigidos; prevenção de recompensas repetidas; nível calculado a partir do XP; datas locais para a sequência; notificações locais sem token push; remoção de dados de submissão de terceiros no EAS.

As chaves de armazenamento anteriores foram preservadas para não apagar progresso. A desinstalação do aplicativo pode apagar dados locais.
