#!/bin/bash

# Códigos de cores ANSI
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # Sem cor

# Função para perguntar ao usuário
perguntar() {
    local comando=$1
    while true; do
        echo -e "${GREEN}Autoriza o comando \"$comando\"? executar [E] passar para o próximo [P] fechar o script [Q]: ${NC}"
        read -p "" escolha
        case $escolha in
            [Ee]* ) eval $comando; local status=$?; return $status;;
            [Pp]* ) return 0;;
            [Qq]* ) echo "Encerrando o script."; exit;;
            * ) echo "Por favor, responda executar [E], passar para o próximo [P], ou fechar o script [Q].";;
        esac
    done
}

# Função para exibir descrição do código de erro
descricao_erro() {
    local codigo=$1
    case $codigo in
        0) echo "Sucesso.";;
        1) echo "Erro genérico.";;
        2) echo "Uso incorreto do shell ou comando.";;
        126) echo "Comando invocado não executável.";;
        127) echo "Comando não encontrado.";;
        128) echo "Erro de saída inválida.";;
        130) echo "Comando terminado pelo sinal de interrupção (Ctrl+C).";;
        137) echo "Comando terminado pelo sinal KILL (kill -9).";;
        *) echo "Código de erro desconhecido: $codigo";;
    esac
}

# Verificar se o rclone já está instalado
perguntar "curl https://rclone.org/install.sh | sudo bash"
status=$?
if [ $status -ne 0 ]; then
    echo -e "${BLUE}Erro ao executar o comando: curl https://rclone.org/install.sh | sudo bash${NC}"
    descricao_erro $status
    echo -e "${BLUE}Código de erro: $status${NC}"
fi

# Criar diretório para montar o Google Drive
perguntar "mkdir -p ./google-drive"
status=$?
if [ $status -ne 0 ]; then
    echo -e "${BLUE}Erro ao executar o comando: mkdir -p ./google-drive${NC}"
    descricao_erro $status
    echo -e "${BLUE}Código de erro: $status${NC}"
fi

# Configurar o rclone para usar o arquivo de conta de serviço
perguntar "rclone config create mydrive drive service_account_file $(pwd)/drive-de-trabalho.json"
status=$?
if [ $status -ne 0 ]; then
    echo -e "${BLUE}Erro ao configurar o rclone.${NC}"
    descricao_erro $status
    echo -e "${BLUE}Código de erro: $status${NC}"
fi

# Verificar se o arquivo de configuração do rclone existe
if [ ! -f "$HOME/.config/rclone/rclone.conf" ]; then
    echo -e "${BLUE}Arquivo de configuração do rclone não encontrado. Certifique-se de que o remote foi configurado corretamente.${NC}"
fi

# Perguntar sobre o comando de montagem separadamente
perguntar "rclone mount mydrive: ./google-drive --daemon"
status=$?
if [ $status -ne 0 ]; then
    echo -e "${BLUE}Erro ao montar o Google Drive.${NC}"
    descricao_erro $status
    echo -e "${BLUE}Código de erro: $status${NC}"
fi

echo -e "${BLUE}Script concluído.${NC}"