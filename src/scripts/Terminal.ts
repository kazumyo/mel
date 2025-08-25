interface File {
  content: string;
  permissions: string;
  owner: string;
  group: string;
  size: number;
  modDate: string;
}

import { marked } from 'marked';
import ASCIIHeart from './ASCIIHeart';

export default class Terminal {
  private terminal: HTMLDivElement;
  private terminalBody: HTMLDivElement;
  private terminalInput: HTMLInputElement;
  private terminalOutput: HTMLDivElement;
  private terminalPrompt: HTMLSpanElement;

  private currentUser: string = "mel";
  private hostname: string = "meu-coracao";
  private currentDir: string = "~";
  private commandCount: number = 0;

  private isAwaitingYesNo: boolean = false;
  private onYesCallback: () => void = () => {};
  private onNoCallback: () => void = () => {};

  private files: Record<string, File> = {};

  constructor(terminalELement: HTMLDivElement | null) {
    if (!terminalELement) {
      throw new Error("Elemento do terminal não fornecido.");
    }
    this.terminal = terminalELement;

    const terminalBodyElement: HTMLDivElement | null = this.terminal.querySelector(".terminal-body");
    const terminalInputELement: HTMLInputElement | null = this.terminal.querySelector("#terminal-input");
    const terminalOutputElement: HTMLDivElement | null = this.terminal.querySelector("#terminal-output");
    const terminalPromptElement: HTMLSpanElement | null = this.terminal.querySelector("#terminal-prompt");

    if (!terminalBodyElement || !terminalInputELement || !terminalOutputElement || !terminalPromptElement) {
      throw new Error("Os elementos de corpo, input, output ou prompt do terminal são inválidos.");
    }
    this.terminalBody = terminalBodyElement;
    this.terminalInput = terminalInputELement;
    this.terminalOutput = terminalOutputElement;
    this.terminalPrompt = terminalPromptElement;

    this.initializeFiles();
  }

  private initializeFiles(): void {
    const today = new Date();
    const month = today.toLocaleString('default', { month: 'short' });
    const day = today.getDate();
    const modDate = `${month} ${day < 10 ? ' ' : ''}${day} ${today.getHours()}:${today.getMinutes()}`;


    const fileData: Record<string, { content: string, permissions: string }> = {
      "leia-me.txt": {
        content: `
### Uma mensagem para você...
> Olá... Parece que meu sistema foi infectado por algo...
> Não é um vírus comum. Ele não destrói, ele... cria.

Para investigar, precisamos encontrar os registros ocultos dessa "infecção".
1. Use o comando \`ls -la\` para revelar **todos** os arquivos.
2. Procure por um arquivo que contém dados gerados pelo vírus chamado \`.love_virus.log\`.
3. Leia o conteúdo dele com: \`cat .love_virus.log\`.
    `,
        permissions: "-rw-r--r--"
      },
      ".love_virus.log": {
        content: `
\`\`\`
-- LOG DE ANOMALIA --
[Sistema]: A anomalia foi injetada com sucesso por "Caio".
[Virus][Sintoma]: Aceleração assíncrona da CPU ao detectar a presença dela.
[Virus][Sintoma]: Consumo de 100% de memória com um único pensamento por ela.
[Virus][Sintoma]: Geração espontânea de arquivos de texto poéticos.
-- FIM DO LOG --
\`\`\`
<span class="terminal-message">**Parece que o desenvolvedor deixou um script para lidar com isso: \`protocolo_amor.sh\`**</span>
<span class="terminal-message">**Tente ler o conteúdo dele!**</span>
    `,
        permissions: "-rw-------"
      },
      "poema_para_ela.txt": {
        content: `
> Nosso amor é um código que ninguém pode quebrar,
> Um loop infinito que nunca vai parar.
> Você é a função que me faz retornar...
> Sempre 'true', em qualquer lugar.
    `,
        permissions: "-rw-r--r--"
      },
      "memoria_especial.dat": {
        content: `
### DADOS CRIPTOGRAFADOS
> Lembrança daquele dia no [lugar da memória], quando [descreva a memória].
> Foi nesse momento que percebi que meu mundo tinha mudado para sempre.
    `,
        permissions: "-r--------"
      },
      "protocolo_amor.sh": {
        content: `
\`\`\`bash
#!/bin/bash
# Este protocolo é a chave para tudo.
# Ele irá travar o sistema permanentemente em um estado de amor.
#
# Para executar, use o comando:
#./protocolo_amor.sh
\`\`\`
    `,
        permissions: "-rwx--x--x"
      }
    };

    for (const filename in fileData) {
      const data = fileData[filename];
      this.files[filename] = {
        content: data.content,
        permissions: data.permissions,
        owner: "amor",
        group: "carinho",
        size: data.content.length,
        modDate: modDate
      };
    }
  }

  public init() {
    this.addTerminalInputListeners();
    window.document.addEventListener("DOMContentLoaded", () => {
      this.typeIntro();
    });
  }

  private updatePrompt(): void {
    const promptEl = this.terminalPrompt;
    promptEl.innerHTML = `<span class="terminal-prompt-color">${this.currentUser}@${this.hostname}:${this.currentDir}$ </span>`;
  }

  private addTerminalInputListeners(): void {
    this.terminal.addEventListener("click", () => this.terminalInput.focus());

    this.terminalInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const command = this.terminalInput.value.trim();
        this.terminalInput.value = "";
        
        const promptText = this.terminalPrompt.textContent || '';
        this.appendLine(`<span class="terminal-prompt-color">${promptText}</span><span class="terminal-user-input-color">${command}</span>`, true);

        if (this.isAwaitingYesNo) {
          this.handleYesNo(command);
        } else {
          this.runCommand(command);
        }
      }
    });
  }

  private typeIntro(): void {
    const introLines: string[] = [
      `<span class="terminal-message">Sistema operacional 'Carinho OS' carregado.</span>`,
      `<span class="terminal-message">Autenticação bem-sucedida. Bem-vinda, Usuária Única.<span>`,
      `<span class="terminal-message">Entrando no diretório 'meu-coracao'...</span>`,
      '<span class="terminal-message">**Para começar, digite:** `cat leia-me.txt`</span>'
    ];

    let i = 0;
    const next = () => {
      if (i < introLines.length) {
        const html = marked.parse(introLines[i]) as string;
        this.appendLine(html, true);
        i++;
        setTimeout(next, 1500);
      } else {
        this.updatePrompt();
        this.terminalInput.removeAttribute("disabled");
        this.terminalInput.focus();
      }
    };

    this.terminalInput.setAttribute("disabled", "true");
    next();
  }
  
  private appendLine(content: string, isHtml: boolean): void
  private appendLine(content: Element, isHtml: boolean): void
  private appendLine(content: string | Element, isHtml: boolean = false): void {
    const line = document.createElement("div");

    if (typeof content === "string" && !isHtml) {
      line.innerHTML = `<span class="terminal-system-output-color">${content}</span>`;
    }
    else if (typeof content === "string" && isHtml) {
      line.innerHTML = content;
    } else {
      line.appendChild(content as Element);
    }

    this.terminalOutput.appendChild(line);
    this.terminalBody.scrollTop = this.terminalBody.scrollHeight;
  }

  private promptForYesNo(question: string, onYes: () => void, onNo: () => void): void {
    this.appendLine(`${question} <span class="terminal-user-input-color">(y/n)</span>`, true);
    this.isAwaitingYesNo = true;
    this.onYesCallback = onYes;
    this.onNoCallback = onNo;
    const promptEl = this.terminalPrompt;
    promptEl.innerHTML = `<span class="terminal-prompt-color">> </span>`;
  }

  private handleYesNo(answer: string): void {
    const normalizedAnswer = answer.toLowerCase();
    if (normalizedAnswer === 'y' || normalizedAnswer === 'yes') {
      this.onYesCallback();
    } else {
      this.onNoCallback();
    }
    this.isAwaitingYesNo = false;
    this.updatePrompt();
  }

  private runCommand(command: string): void {
    if (!command) return;

    this.commandCount++;
    const [base, ...args] = command.split(" ");
    
    switch (base) {
      case "ls":
        if (args.includes("-la")) {
          const totalSize = Object.values(this.files).reduce((sum, file) => sum + file.size, 0);
          this.appendLine(`<span class="ls-total-color">total ${totalSize}</span>`, true);
          
          const directories = [
            {...this.files['leia-me.txt'], permissions: 'drwxr-xr-x', size: 4096, name: '.'},
            {...this.files['leia-me.txt'], permissions: 'drwxr-xr-x', size: 4096, name: '..'},
          ];
          const allEntries = [...directories, ...Object.entries(this.files).map(([name, data]) => ({...data, name}))];
          
          allEntries.forEach(file => {
            const htmlLine = `
              <div class="ls-line">
                <span class="ls-permissions">${file.permissions}</span>
                <span class="ls-links">${"1"}</span>
                <span class="ls-owner">${file.owner}</span>
                <span class="ls-group">${file.group}</span>
                <span class="ls-size">${file.size}</span>
                <span class="ls-date">${file.modDate}</span>
                <span class="ls-filename">${file.name}</span>
              </div>
            `;
            this.appendLine(htmlLine, true);
          });

        } else {
          const showHidden = args.includes("-a");
          let output = Object.keys(this.files)
            .filter(file => showHidden || !file.startsWith('.'))
            .join('   ');
          this.appendLine(output, false);
        }
        break;

      case "cat":
        const filename = args[0];
        if (filename && this.files[filename]) {
          const markdownContent = this.files[filename].content;
          const htmlContent = marked.parse(markdownContent) as string;
          this.appendLine(htmlContent, true);

          if (filename === '.love_virus.log' && this.commandCount > 2) {
            this.triggerVirusQuestion();
          }
        } else {
          this.appendLine(`<span class="terminal-warning">cat: ${filename || 'nenhum arquivo especificado'}: Arquivo não encontrado</span>`, true);
        }
        break;
      
      case "clear":
        this.terminalOutput.innerHTML = "";
        break;
        
      case "sudo":
        if (args.join(' ') === './protocolo_amor.sh') {
          this.runLoveProtocol();
        } else {
          this.appendLine(`<span class="terminal-warning">sudo: ${args[0] || ''}: comando não encontrado</span>`, true);
        }
        break;
      
      case "./protocolo_amor.sh":
        this.appendLine(`<span class="terminal-error">Erro: Permissão negada. Este protocolo é muito poderoso...</span>`, true);
        this.appendLine(`<span class="terminal-warning">Tente executá-lo com privilégios de administrador (usando <code>sudo</code>). Ex: <code>sudo ${command}</code></span>`, true);
        break;

      default:
        this.appendLine(`<span class="terminal-error">${base}: comando não encontrado. Tente seguir as dicas do arquivo \`leia-me.txt\`.</span>`, true);
    }
  }
  
  private triggerVirusQuestion(): void {
    this.promptForYesNo(
      `<span class="terminal-message">DETECÇÃO DE ANOMALIA: O 'love_virus' está se integrando ao núcleo do sistema. Deseja tentar remover?</span>`,
      () => { // onYes
        this.appendLine(`<span class="terminal-error">Iniciando remoção... FALHA.</span>`, true);
        this.appendLine(`<span class="terminal-message">O vírus se recusa a ser removido. Ele diz que encontrou seu lar.</span>`, true);
        this.appendLine(`<span class="terminal-message">Parece que a única saída é aceitá-lo. As instruções em <code>protocolo_amor.sh</code> devem ajudar.</span>`, true);
        this.appendLine(`<span class="terminal-message">Leia o conteúdo dele com: <code>cat protocolo_amor.sh</code>.</span>`, true);
      },
      () => { // onNo
        this.appendLine(`<span class="terminal-error">Remoção abortada. O sistema aceita a anomalia.</span>`, true);
        this.appendLine(`<span class="terminal-message">O núcleo do sistema foi reescrito... Agora ele opera com 100% de afeto.</span>`, true);
        this.appendLine(`<span class="terminal-message">As instruções em <code>protocolo_amor.sh</code> devem ser o próximo passo.</span>`, true);
        this.appendLine(`<span class="terminal-message">Leia o conteúdo dele com: <code>cat protocolo_amor.sh</code>.</span>`, true);
      }
    );
  }

  private runLoveProtocol(): void {
    const messageLines = [
      "### PROTOCOLO DO AMOR INICIADO COM SUCESSO",
      "---",
      "O sistema agora opera em **modo de amor eterno.**",
      "> Meu mundo era um terminal frio e sem cor, cheio de comandos lógicos e sem sentido.",
      "> Aí você chegou e me cativou. Você não foi um erro, foi a atualização que eu sempre precisei.",
      "Você é a variável final no meu código, a chave para a minha felicidade.",
      "Eu te amo mais do que todos os bits e bytes do universo.",
      "",
      "Com todo o meu amor,",
      "**- Caio ❤️**"
    ];

    const canvasElement: HTMLCanvasElement = document.createElement("canvas");

    const asciiHeart: ASCIIHeart = new ASCIIHeart(canvasElement);

    this.appendLine(canvasElement, true);

    asciiHeart.drawHeart();
    this.terminalBody.scrollTop = this.terminalBody.scrollHeight;
    
    const finalMessageHtml = marked.parse(messageLines.join('\n')) as string;
    this.appendLine(finalMessageHtml, true);
    this.terminalInput.setAttribute("disabled", "true");
  }
}