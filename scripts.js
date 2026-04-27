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
            status
        };

        activities.push(atividade);

        localStorage.setItem('activities', JSON.stringify(activities));

        console.log('Atividades salvas:', activities);
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