const graph = document.getElementById('graphic')
let graphInstance = null;

    function atualizarGrafico() {
        const activities = JSON.parse(localStorage.getItem('activities')) || [];

        const categorias = {
            'Acadêmica': 0,
            'Doméstica': 0,
            'Física': 0,
            'Lazer': 0
        };

        activities.forEach((atividade) => {
            if (atividade.tipo === 'Lazer (Recreativo)') {
                categorias['Lazer']++;
            } else if (categorias.hasOwnProperty(atividade.tipo)) {
                categorias[atividade.tipo]++;
            }
        });

        const dados = [
            categorias['Acadêmica'],
            categorias['Doméstica'],
            categorias['Física'],
            categorias['Lazer']
        ];

        if (graphInstance) {
            graphInstance.data.datasets[0].data = dados;
            graphInstance.update();
            return;
        }

        graphInstance = new Chart(graph, {
            type: 'bar',
            data: {
                labels: ['Acadêmica', 'Doméstica', 'Física', 'Lazer'],
                datasets: [{
                    data: dados,
                    backgroundColor: [
                        '#916fa9',
                        '#a978d7',
                        '#9169b9',
                        '#d7aff5'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        border: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        min: 0,
                        max: 5,
                        border: {
                            display: false
                        },
                        ticks: {
                            callback: function(value) {
                                if (value === 0 || value === 0.5 || value === 1) {
                                    return value.toFixed(1).replace('.', ',');
                                }
                                return '';
                            }
                        },
                        grid: {
                            color: function(context) {
                                return context.tick.value % 0.5 === 0
                                    ? '#d1d5db'
                                    : '#eceff1';
                            }
                        },
                        afterBuildTicks: (scale) => {
                            scale.ticks = [
                                { value: 0 },
                                { value: 1 },
                                
                            ];
                        }
                    }
                }
            }
        });
    }

    

    const hoje = new Date().toISOString().split('T')[0];
    document.getElementById('data').setAttribute('min', hoje);

    window.addEventListener('load', () => {
        loadData();
    });

    google.charts.load('current', {
        'packages': ['geochart', 'bar', 'corechart'],
    });

    google.charts.setOnLoadCallback(drawMap);


    var activities = [];

    function AddActivity(nome, tipo, data, status) {
        const atividade = {
            nome,
            tipo,
            data,
            status,
            id : Contagem()
        };

        activities.push(atividade);

        localStorage.setItem('activities', JSON.stringify(activities));
        AddLista(nome, tipo, data, status, atividade);
        Contagem();
        console.log('Atividades salvas:', activities);
    }

    function AddLista(nome, tipo, data, status, atividade){
        const table = document.getElementById("Table");

        const tr = document.createElement("tr");
        const tdNome = document.createElement("td");
        const tdTipo = document.createElement("td");
        const tdData = document.createElement("td");
        const tdAcoes = document.createElement("td");
        const btnDelete = document.createElement("button");
        const btnCheckbox = document.createElement("button");

        btnCheckbox.textContent = status ? "✔️" : "❌";
        btnCheckbox.onclick = () => {
            const atual = tr.dataset.status === "true";
            const novo = !atual;

            tr.dataset.status = novo.toString();
            atividade.status = novo

            btnCheckbox.textContent = novo ? "✔️" : "❌";
            Contagem();
        }
        btnDelete.textContent = "🗑️";
        btnDelete.onclick = () => {
            tr.remove();
            activities = activities.filter(a => a.id !== atividade.id);
            Contagem();
        }

        tdNome.textContent = nome;
        tdTipo.textContent = tipo;
        tdData.textContent = data;

        tdAcoes.appendChild(btnCheckbox);
        tdAcoes.appendChild(btnDelete)
        tr.appendChild(tdNome);
        tr.appendChild(tdTipo);
        tr.appendChild(tdData);
        tr.appendChild(tdAcoes)

        tr.dataset.status = status.toString();
        

        table.appendChild(tr);
        
    }

    function Contagem(){

        const divPendencia = document.getElementById("Pendentes");
        const divFinalizadas = document.getElementById("Finalizadas");
        const divTotal = document.getElementById("Total");

        let pendencias = 0;
        let finalizadas = 0;
        let total = 0;

        activities.forEach((atividade) => {
            total++;

            if (atividade.status === true || atividade.status === "true") {
                finalizadas++;
            } else {
                pendencias++;
            }
        });

        divPendencia.textContent = " " + pendencias;
        divFinalizadas.textContent = " " + finalizadas;
        divTotal.textContent = " " + total;
        return total;

    }
    
    function Filtro(){
        const checkbox = document.getElementById("check1");
        const checkbox2 = document.getElementById("check2");

        if(checkbox.checked){
            Filtragem("false")
        }else if(checkbox2.checked){
            Filtragem("true")
        }
        else {
            Filtragem(undefined)
        }

    }

    function Filtragem(status) {
        const table = document.getElementById("Table");

        
        table.innerHTML = "";
        if(activities != undefined){
            activities
            .filter(atividade => atividade.status.toString() === status)
            .forEach((atividade) => {

                const tr = document.createElement("tr");

                const tdNome = document.createElement("td");
                const tdTipo = document.createElement("td");
                const tdData = document.createElement("td");
                const tdAcoes = document.createElement("td");

                const btnDelete = document.createElement("button");
                const btnCheckbox = document.createElement("button");

                tdNome.textContent = atividade.nome;
                tdTipo.textContent = atividade.tipo;
                tdData.textContent = atividade.data;

                
                btnCheckbox.textContent = atividade.status ? "✔️" : "❌";

                btnCheckbox.onclick = () => {
                    atividade.status = !atividade.status;
                    Filtragem(status); 
                    Contagem();
                };

                
                btnDelete.textContent = "🗑️";

                btnDelete.onclick = () => {
                    activities = activities.filter(a => a.id !== atividade.id);
                    Filtragem(status);
                    Contagem();
                };

                tdAcoes.appendChild(btnCheckbox);
                tdAcoes.appendChild(btnDelete);

                tr.appendChild(tdNome);
                tr.appendChild(tdTipo);
                tr.appendChild(tdData);
                tr.appendChild(tdAcoes);

                table.appendChild(tr);
            });
        }else{
            console.log("ativou")
            activities.forEach((atividade) => {

                const tr = document.createElement("tr");

                const tdNome = document.createElement("td");
                const tdTipo = document.createElement("td");
                const tdData = document.createElement("td");
                const tdAcoes = document.createElement("td");

                const btnDelete = document.createElement("button");
                const btnCheckbox = document.createElement("button");

                tdNome.textContent = atividade.nome;
                tdTipo.textContent = atividade.tipo;
                tdData.textContent = atividade.data;

                
                btnCheckbox.textContent = atividade.status ? "✔️" : "❌";

                btnCheckbox.onclick = () => {
                    atividade.status = !atividade.status;
                    Filtragem(status); 
                    Contagem();
                };

                
                btnDelete.textContent = "🗑️";

                btnDelete.onclick = () => {
                    activities = activities.filter(a => a.id !== atividade.id);
                    Filtragem(status);
                    Contagem();
                };

                tdAcoes.appendChild(btnCheckbox);
                tdAcoes.appendChild(btnDelete);

                tr.appendChild(tdNome);
                tr.appendChild(tdTipo);
                tr.appendChild(tdData);
                tr.appendChild(tdAcoes);

                table.appendChild(tr);
            })
        
        }
    }

    document.getElementById('formAtividade').addEventListener('submit', function (e) {
        e.preventDefault();

        const nome = document.querySelector('.form-input-text').value;
        const tipo = document.querySelector('.form-input-select').value;
        const data = document.getElementById('data').value;

        AddActivity(nome, tipo, data, false);
        atualizarGrafico();

        this.reset();
    });

    function drawMap() {
        const activities = JSON.parse(localStorage.getItem('activities')) || [];

        console.log(activities);

        activities.forEach((atividade) => {
            console.log(
                atividade.nome,
                atividade.tipo,
                atividade.data,
                atividade.status
            );
        });
    }

    function loadData() {
        const activities = JSON.parse(localStorage.getItem('activities')) || [];
    }


/*
    Isso dá erro, mas mantenho caso o codigo exploda
    window.addEventListener('load', () => {
        loadData();
    });

    google.charts.load('current', {
        'packages': ['geochart', 'bar', 'corechart'],
    });

    google.charts.setOnLoadCallback(drawMap);

*/