Vue.component('multiselect', VueMultiselect.Multiselect);

Vue.component('modal', {template: '#modal-template'});
Vue.filter('percent', function(numero){ return parseFloat(numero * 100).toFixed(2); });

new Vue({
    el: '#app',
    data: function() {
        return {
            showModal: false,
            experimentos: {
                selectedOption: null,
                options: [],
                isLoading: false
            },
            modelos: {
                selectedOption: null,
                options: [],
                isLoading: false
            },
            bibliotecas: {
                selectedOption: null,
                options: [],
                isLoading: false
            },
            graph: {
                isLoading: false,
                data: []
            },
            table: {
                isLoading: false,
                headers: [],
                rows: []
            },
            diff: {
                isLoading: false,
                data: {title: "", txt: ""}
            }
        };
    },
    methods: {
        loadExperimentos: function() {
            var that = this;
            that.experimentos.isLoading = true;

            jQuery.getJSON('/experimentos', function(json) {
                that.experimentos.isLoading = false;
                that.experimentos.options = json;
            });
        },
        loadModelos: function() {
            var that = this;
            that.modelos.isLoading = true;

            jQuery.getJSON('/modelos/' + that.experimentos.selectedOption.value, function(json) {
                that.modelos.isLoading = false;
                that.modelos.options = json;
            });
        },
        loadBibliotecas: function() {
            var that = this;
            that.bibliotecas.isLoading = true;

            var url = '/bibliotecas/'
                + that.experimentos.selectedOption.value + '/'
                + that.modelos.selectedOption.value;

            jQuery.getJSON(url, function(json) {
                that.bibliotecas.isLoading = false;
                that.bibliotecas.options = json;
            });
        },
        loadGraph: function() {
            var that = this;
            that.graph.isLoading = true;

            var url = '/graph/'
                + that.experimentos.selectedOption.value + '/'
                + that.modelos.selectedOption.value + '/'
                + that.bibliotecas.selectedOption.value;

            jQuery.getJSON(url, function(json) {
                that.graph.isLoading = false;
                that.graph.data = json;
                Plotly.newPlot('plotly', json);
            });
        },
        loadTable: function() {
            var that = this;
            that.table.isLoading = true;

            var url = '/table/'
                + that.experimentos.selectedOption.value + '/'
                + that.modelos.selectedOption.value + '/'
                + that.bibliotecas.selectedOption.value;

            jQuery.getJSON(url, function(json) {
                that.table.isLoading = false;
                that.table.headers = Object.keys(json[0]);
                that.table.rows = json;
            });
        },
        loadDiff: function(heuriticaId, rodada) {
            var that = this;
            that.diff.isLoading = true;

            // /diff/:experimentoId/:modeloId/:bibliotecaId/:heuriticaId/:rodada
            var url = '/diff/'
                + that.experimentos.selectedOption.value + '/'
                + that.modelos.selectedOption.value + '/'
                + that.bibliotecas.selectedOption.value + '/'
                + heuriticaId + '/'
                + rodada;

            jQuery.get(url, function(data) {
                that.diff.isLoading = false;
                that.diff.data = data;

                setTimeout(function() {
                    var d = new Diff2HtmlUI({diff: data.text})
                    d.draw('#diff', {showFiles: false, matching: 'lines'});

                    jQuery('#thedialog').modal();
                }, 100);
            });
        }
    },
    mounted: function() {
        this.loadExperimentos();
    }
});