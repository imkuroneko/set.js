$(function() {
    app.init();

    $('#search').on('click', () => { app.search(); });
});

const app = {
    dataTable: '',

    init: () => { },

    search: () => {
        const v_dato = $('#lLgSk1XIZNwzxxnE0mUGJxVoSsoUgw').val().trim();

        if(!v_dato) { return swal('🙅🏻‍♀️', 'Por favor escriba el dato a buscar'); }

        $.ajax({
            url: '/',
            type: 'POST',
            data: JSON.stringify({ dato: v_dato }),
            processData: false,
            contentType: 'application/json',
            success: (rst) => {
                if(rst.status) {
                    $('#rst').html(rst.html);

                    new simpleDatatables.DataTable('table', {
                        searchable: true,
                        sortable: true,
                        perPage: 25,
                        perPageSelect: [ 25, 50, 75, 100 ],
                        truncatePager: true,
                        fixedHeight: true,
                        labels: {
                            placeholder: "Buscar...",
                            perPage: "{select} registros por página",
                            noRows: "No se encontraron registros",
                            info: "Mostrando {start} a {end} de {rows} registros",
                            noResults: "No hay resultados para la búsqueda realizada"
                        }
                    });
                } else {
                    return swal("🙈", rst.message);
                }
            }
        });
    }
}