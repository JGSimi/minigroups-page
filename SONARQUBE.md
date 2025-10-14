# SonarQube - Análise de Qualidade de Código

Este projeto está configurado para análise de qualidade de código usando SonarQube/SonarCloud.

## O que é o SonarQube?

SonarQube é uma plataforma de análise estática de código que identifica:
- Bugs e vulnerabilidades de segurança
- Code smells (problemas de manutenibilidade)
- Duplicação de código
- Cobertura de testes
- Complexidade ciclomática

## Configuração Atual

O projeto já possui:
- `sonar-project.properties` - Configuração do projeto
- Script `npm run sonar` - Comando para executar análise
- `sonarqube-scanner` instalado como devDependency

## Opção 1: SonarCloud (Recomendado - Gratuito para projetos públicos)

### Passo 1: Criar conta no SonarCloud
1. Acesse https://sonarcloud.io
2. Faça login com sua conta GitHub
3. Autorize o SonarCloud a acessar seus repositórios

### Passo 2: Importar o projeto
1. Clique em "+" (Analyze new project)
2. Selecione o repositório `minigroups`
3. Clique em "Set Up"

### Passo 3: Obter o token
1. Vá em "My Account" > "Security"
2. Gere um novo token
3. Copie o token gerado

### Passo 4: Configurar localmente
Edite o arquivo `sonar-project.properties` e adicione:
```properties
sonar.organization=seu-username-github
sonar.host.url=https://sonarcloud.io
```

### Passo 5: Executar análise
```bash
# No diretório raiz do projeto
npm run sonar -- -Dsonar.token=SEU_TOKEN_AQUI
```

### Passo 6 (Opcional): Análise automática com GitHub Actions
Crie o arquivo `.github/workflows/sonarcloud.yml`:

```yaml
name: SonarCloud Analysis
on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  sonarcloud:
    name: SonarCloud
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: SonarCloud Scan
        uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

Adicione o `SONAR_TOKEN` como secret no GitHub:
1. Settings > Secrets and variables > Actions
2. New repository secret
3. Nome: `SONAR_TOKEN`, Valor: seu token do SonarCloud

## Opção 2: SonarQube Local (Docker)

### Passo 1: Iniciar SonarQube
```bash
docker run -d --name sonarqube \
  -p 9000:9000 \
  sonarqube:community
```

### Passo 2: Acessar e configurar
1. Acesse http://localhost:9000
2. Login padrão: admin/admin (será solicitado para alterar)
3. Crie um novo projeto local
4. Gere um token de análise

### Passo 3: Executar análise
```bash
# No diretório raiz do projeto
npm run sonar -- \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.token=SEU_TOKEN_AQUI
```

## Visualizar Resultados

### SonarCloud
- Acesse: https://sonarcloud.io/organizations/seu-username/projects
- Veja métricas em tempo real no dashboard

### SonarQube Local
- Acesse: http://localhost:9000
- Navegue até seu projeto

## Métricas Analisadas

### Reliability (Confiabilidade)
- Bugs que podem causar comportamento incorreto

### Security (Segurança)
- Vulnerabilidades de segurança (OWASP Top 10)
- Security Hotspots que requerem revisão

### Maintainability (Manutenibilidade)
- Code Smells que dificultam manutenção
- Technical Debt estimado

### Coverage (Cobertura)
- Percentual de código coberto por testes
- *Nota*: Requer configuração de testes unitários

### Duplications (Duplicações)
- Blocos de código duplicado

## Próximos Passos para Melhorar a Análise

### 1. Adicionar Testes Unitários
```bash
# Instalar Vitest (recomendado para Vite)
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom

# Ou Jest
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

### 2. Configurar Coverage
Adicione no `package.json`:
```json
"scripts": {
  "test": "vitest",
  "test:coverage": "vitest run --coverage"
}
```

Descomente no `sonar-project.properties`:
```properties
sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.typescript.lcov.reportPaths=coverage/lcov.info
```

### 3. Executar antes da análise
```bash
npm run test:coverage
npm run sonar
```

## Exclusões Configuradas

O arquivo `sonar-project.properties` já exclui:
- `node_modules/` - Dependências
- `dist/` e `build/` - Arquivos compilados
- `src/components/ui/**` - Componentes shadcn/ui (externos)
- Arquivos de configuração
- Arquivos de definição TypeScript

## Integração com CI/CD

### GitHub Actions (já mencionado acima)
### GitLab CI
```yaml
sonarqube:
  image: sonarsource/sonar-scanner-cli:latest
  script:
    - sonar-scanner
  only:
    - main
    - merge_requests
```

### Jenkins
```groovy
stage('SonarQube Analysis') {
  steps {
    script {
      def scannerHome = tool 'SonarScanner'
      withSonarQubeEnv('SonarQube') {
        sh "${scannerHome}/bin/sonar-scanner"
      }
    }
  }
}
```

## Dicas

1. **Execute regularmente**: Rode a análise a cada mudança significativa
2. **Monitore tendências**: Acompanhe a evolução das métricas ao longo do tempo
3. **Quality Gate**: Configure gates de qualidade para bloquear merges com issues críticos
4. **Code Review**: Use os resultados do SonarQube durante code reviews
5. **Priorize**: Foque primeiro em bugs e vulnerabilidades de segurança

## Troubleshooting

### Erro: "sonar-scanner: command not found"
Certifique-se de que instalou: `npm install --save-dev sonarqube-scanner`

### Erro: "Unauthorized"
Verifique se o token está correto e tem permissões adequadas

### Análise muito lenta
Considere adicionar mais exclusões no `sonar-project.properties`

### Coverage não aparece
1. Execute os testes com coverage: `npm run test:coverage`
2. Verifique se o caminho do lcov.info está correto
3. Descomente as linhas de coverage no `sonar-project.properties`

## Recursos Úteis

- [SonarCloud](https://sonarcloud.io)
- [Documentação SonarQube](https://docs.sonarqube.org/latest/)
- [SonarQube TypeScript Analysis](https://docs.sonarqube.org/latest/analysis/languages/typescript/)
- [Quality Gates](https://docs.sonarqube.org/latest/user-guide/quality-gates/)

## Suporte

Para issues relacionados ao SonarQube:
- SonarCloud: https://community.sonarsource.com/
- SonarQube: https://github.com/SonarSource/sonarqube/issues
