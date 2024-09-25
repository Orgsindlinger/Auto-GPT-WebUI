#!/bin/bash

# Função para verificar se um comando existe
command_exists() {
    command -v "$1" &> /dev/null
}

# Instalar Conda se não estiver instalado
if ! command_exists conda; then
    echo -e "\033[34mConda não encontrado. Instalando Miniconda...\033[0m"
    wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O ~/miniconda.sh
    bash ~/miniconda.sh -b -p $HOME/miniconda
    export PATH="$HOME/miniconda/bin:$PATH"
    conda init
    source ~/.bashrc
fi

# Criar e ativar um ambiente virtual com Conda
if ! conda info --envs | grep -q "myenv"; then
    echo -e "\033[34mCriando e ativando um ambiente virtual com Conda...\033[0m"
    conda create -n Auto-GPT-WeebUI python=3.9 -y
fi
echo -e "\033[34mAtivando o ambiente virtual Conda 'myenv'...\033[0m"
source activate myenv

# Instalar Poetry se não estiver instalado
if ! command_exists poetry; then
    echo -e "\033[34mInstalando Poetry...\033[0m"
    curl -sSL https://install.python-poetry.org | python3 -
    export PATH="$HOME/.local/bin:$PATH"
fi

# Ativar o ambiente virtual do Poetry
echo -e "\033[34mAtivando o ambiente virtual do Poetry...\033[0m"
poetry shell

# Instalar dependências Python usando Poetry
echo -e "\033[34mInstalando dependências Python com Poetry...\033[0m"
poetry install --no-root

# Instalar Node.js se não estiver instalado ou atualizar para a versão 18.x
if ! command_exists node || [[ $(node -v) < "v18.0.0" ]]; then
    echo -e "\033[34mNode.js não encontrado ou versão incompatível. Instalando Node.js 18.x...\033[0m"
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Atualizar npm para a versão mais recente
echo -e "\033[34mAtualizando npm para a versão mais recente...\033[0m"
sudo npm install -g npm@latest

# Instalar dependências Node.js globalmente com sudo
echo -e "\033[34mInstalando dependências Node.js globalmente...\033[0m"
sudo npm install -g vite 
sudo npm install -g yarn 

# Navegar até o diretório front e instalar dependências do projeto
if [ -d "front" ]; then
    echo -e "\033[34mNavegando até o diretório front e instalando dependências do projeto...\033[0m"
    cd front
    yarn install --force
else
    echo -e "\033[31mDiretório 'front' não encontrado. Certifique-se de que o diretório existe.\033[0m"
fi