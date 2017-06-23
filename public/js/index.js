Vue.component('multiselect', VueMultiselect.Multiselect);

new Vue({
    el: '#app',
    data: function() {
        return {
            experimentos: {
                selectedOption: null,
                options: [{text:"Sim", value: "não"}],
                isLoading: false
            },
            modelos: {
                selectedOption: null,
                options: [{text:"Sim", value: "não"}],
                isLoading: false
            },
            bibliotecas: {
                selectedOption: null,
                options: [{text:"Sim", value: "não"}],
                isLoading: false
            },
            graph: {
                isLoading: false,
                data: []
            },
            table: {
                headers: [],
                rows: []
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

            jQuery.getJSON('/bibliotecas/' + that.experimentos.selectedOption.value + "/" + that.modelos.selectedOption.value , function(json) {
                that.bibliotecas.isLoading = false;
                that.bibliotecas.options = json;
            });
        },
        loadGraph: function() {
            var that = this;
            that.graph.isLoading = true;

            var url = '/graph/'
                + that.experimentos.selectedOption.value + '/'
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
                + that.bibliotecas.selectedOption.value;

            jQuery.getJSON(url, function(json) {
                that.table.isLoading = false;
                that.table.headers = Object.keys(json[0]);
                that.table.rows = json;
            });
        }
    },
    mounted: function() {
        this.loadExperimentos();
    }
});