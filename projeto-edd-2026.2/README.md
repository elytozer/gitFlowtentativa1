Perguntas:

1. Na classe ArrayContainer o método draw() utiliza dois estilos de loops. Explique o funcionamento e objetivos de cada um deles. 
for:calcula a coordenada onde cada numero i fica na tela, desenha um quadrado com a borda pontilhada, evita que os próximos desenhos fiquem pontilhados por engano
forEach:"lê" a lista de elementos e objetos inseridos e chama o método de desenho de cada um deles

2. Altere o código do método draw() na classe AraryContainer para:
    a) desenhar apenas os espaços utilizados no array.  
    b) utilizar apenas um único loop. Dica: Utilize o método entries da classe array.

3. É possível aplicar busca binária no array do jeito que ele é preenchido hoje? Justifique. Qual é o número máximo de comparações de cada busca para um array cheio com 10 elementos? E com 1.000 elementos?
não é possivel, a busca binaria precisa que a lista seja ordenada.
array 10 elementos: 4 comparações
array 1000 elementos: 10 ||

4. Crie no formulário um botão para ordenar os elementos.


5. Adicione um campo "Buscar valor " e dois botões no formulário (busca sequencial e busca binária). Crie os métodos na classe ArrayContainer, que retorna o índice encontrado ou -1. No final, exiba na mensagem quantas comparações foram feitas e se o elemento foi encontrado e onde foi encontrado.

6. Crie um formulário e uma função para inserir elementos de forma ordenada. 

7. Modularização com ESM. Divida o app.js em square.js, array-container.js, canvas-app.js, form-controller.js e main.js, usando export/import. Ajuste o HTML para type="module" e rode o projeto com um servidor local
usei o live server

Atividades práticas



2. Remoção com reposicionamento. Crie na classe Square um método moveTo(x, y) que reinicia a animação para um novo destino, reaproveitando progress e o easing. Depois, implemente removeAt(index) em ArrayContainer usando splice. Os quadrados que estavam à direita do removido devem deslizar para a esquerda.

3. Inserção ordenada + busca binária. (Depende da atividade 2.) Adicione uma opção "Modo ordenado". Nesse modo, cada valor novo é inserido na posição correta e os quadrados maiores deslizam para a direita. Em seguida, implemente binarySearch(value) destacando visualmente low, mid e high a cada passo. Compare o número de comparações com o da atividade 1 usando os mesmos valores.

4. Modularização com ESM. Divida o app.js em square.js, array-container.js, canvas-app.js, form-controller.js e main.js, usando export/import. Ajuste o HTML para type="module" e rode o projeto com um servidor local (Live Server ou npx serve). Explique no README por que o projeto não funciona mais com duplo clique no index.html.

5. Funções e estatísticas do array. Crie um painel abaixo do canvas com soma, média, maior e menor valor. Os cálculos devem usar reduce, map e filter, sem laços for. Inclua também um botão "Destacar pares" que recebe uma função de callback (destacar(fn)), para permitir reutilizar o mesmo método com outros critérios, como v => v > 10.