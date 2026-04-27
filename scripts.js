const graph = document.getElementById('graphic')

    new Chart(graph, {
        type: 'bar',
        data: {
            labels: ['Acadêmica', 'Doméstica', 'Física', 'Lazer'],
            datasets: [{
                data: [10, 20, 30, 40],
                backgroundColor: ''
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                }
            }
        }   
    })

    const hoje = new Date().toISOString().split('T')[0];
    document.getElementById('data').setAttribute('min', hoje);

    window.addEventListener('load', () => {
        loadData();
    });

    google.charts.load('current', {
        'packages': ['geochart', 'bar', 'corechart'],
    });

    google.charts.setOnLoadCallback(drawMap);


    var activities

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
