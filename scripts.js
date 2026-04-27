const graph = document.getElementById('graphic')

    new Chart(graph, {
        type: 'bar',
        data: {
            labels: ['Acadêmica', 'Doméstica', 'Física', 'Lazer'],
            datasets: [{
                data: ['0.0', '0.5', '1.0'],
                backgroundColor: [
                    '#916fa9',
                    '#a978d7',
                    '#9169b9',
                    '#d7aff5'
                ]
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    border: {
                        display: false
                    }
                },
                y: {
                    grid: {
                        display: true
                    },
                    border: {
                        display: false
                    },
                    beginAtZero: true,
                    min: 0,
                    max: 1,
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
                            if (context.tick.value % 0.5 === 0) {
                                return '#d1d5db';
                            }
                            return '#eceff1';
                        }
                    },
                    afterBuildTicks: (scale) => {
                        scale.ticks = [
                            { value: 0 },
                            { value: 0.25 },
                            { value: 0.5 },
                            { value: 0.75 },
                            { value: 1.0 }
                        ];
                    }
                }
            }
        }
    }
    );

    const hoje = new Date().toISOString().split('T')[0];
    document.getElementById('data').setAttribute('min', hoje);


    var activities = [];

    function AddActivity(nome, tipo, data, status){
        let atividade = {
            nome : nome,
            tipo : tipo,
            data : data,
            status : status
        }
        activities.push(atividade)
        console.log(atividade)
    }

    document.querySelector('#save').addEventListener('click', function(e){
        e.preventDefault();

        const nome = document.querySelector('.form-input-text').value;
        const tipo = document.querySelector('.form-input-select').value;
        const data = document.querySelector('#data').value;
        AddActivity(nome, tipo, data, false);

    })


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