Vue.component("contador-label", {
  props: ["text"],
  template: `
    <label class= "default-margin">{{ text }}</label>
  `,
});

Vue.component("date-input", {
  template: `
    <input v-on:change="$emit('func-call', $event.target.value)" type= "date" class= "default-margin">
  `,
});

Vue.component("text-input", {
  template: `
    <input v-on:change="$emit('func-call', $event.target.value)" type= "text" class= "default-margin text-input">
  `,
});

Vue.component("res-text-input", {
  template: `
    <input v-on:change="$emit('func-call', $event.target.value)" type= "text" class= "default-margin res-text-input">
  `,
});

Vue.component("btn-input", {
  template: `
    <input type= "button" class= "default-margin btn-input bottom-margin"  v-on:click= "$emit('calcular')">
  `,
});

const app = new Vue({
  el: "#app",
  data: {
    fecha: "fecha",
    lecturaFactura: "Lectura Factura",
    ultimaLectura: "Ultima Lectura",
    calcular: "Calcular",
    fechaFactura: Date,
    billCount: 0,
    currentCount: 0,
    promCons: 0,
    cons: 0,
    estimado: 0,
    pagar: 0,
    dias: 0,
    buckets: [
      {
        min: 0,
        max: 100,
        cont: 0,
        precio: 0.33,
      },{
        min: 101,
        max: 150,
        cont: 0,
        precio: 1.07,
      },{
        min: 151,
        max: 200,
        cont: 0,
        precio: 1.43,
      },{
        min: 201,
        max: 250,
        cont: 0,
        precio: 2.46,
      },{
        min: 251,
        max: 300,
        cont: 0,
        precio: 3.00,
      },{
        min: 301,
        max: 350,
        cont: 0,
        precio: 4.00,
      },{
        min: 351,
        max: 400,
        cont: 0,
        precio: 5.00,
      },{
        min: 401,
        max: 450,
        cont: 0,
        precio: 6.00,
      },{
        min: 451,
        max: 500,
        cont: 0,
        precio: 7.00,
      },{
        min: 501,
        max: 600,
        cont: 0,
        precio: 9.20,
      },{
        min: 601,
        max: 700,
        cont: 0,
        precio: 9.45,
      },{
        min: 701,
        max: 1000,
        cont: 0,
        precio: 9.85,
      },{
        min: 1001,
        max: 1800,
        cont: 0,
        precio: 10.80,
      },{
        min: 1801,
        max: 2600,
        cont: 0,
        precio: 11.80,
      },{
        min: 2601,
        max: 3400,
        cont: 0,
        precio: 12.90,
      },{
        min: 3401,
        max: 4200,
        cont: 0,
        precio: 13.95,
      },{
        min: 4201,
        max: 5000,
        cont: 0,
        precio: 15.00,
      },{
        min: 5000,
        max: '',
        cont: 0,
        precio: 20.00,
      }
    ]
  },
  template: `
    <div class= "contenedor">
      <contador-label class= "default-label" text= "Fecha ultima factura" v-bind:for="fecha"></contador-label>
        <date-input v-on:func-call= "setDate" class= "default-margin ultima-lectura-fecha" v-bind:id="fecha"></date-input>
      <contador-label class= "default-label" text= "Lectura ultima factura" v-bind:for="lecturaFactura"></contador-label>
        <text-input v-on:func-call= "setBillCount" class= "default-margin ultima-lectura-fecha" v-bind:id="lecturaFactura"></text-input>
          <div class= "um">
            kWs
          </div>
      <contador-label class= "default-label" text= "Ultima lectura" v-bind:for="ultimaLectura"></contador-label>
        <text-input v-on:func-call= "setCurrentCount" class= "default-margin ultima-lectura-fecha" v-bind:id="ultimaLectura"></text-input>
          <div class= "um">
            kWs
          </div>
      <btn-input class= "calc-btn" v-on:calcular= "calcularConsumo" v-bind:value= "calcular"></btn-input>
      <div class= "contenedor-interno">
        <div class= "contenerdor-interno-izquierdo">
          <contador-label class= "default-label" text= "Promedio"></contador-label>
            <res-text-input v-model= "promCons"></res-text-input>
          <contador-label class= "default-label" text= "Consumo"></contador-label>
            <res-text-input v-model= "cons"></res-text-input>
          <contador-label class= "default-label" text= "Estimado"></contador-label>
            <res-text-input v-model= "estimado"></res-text-input>
        </div>
        <div class= "contenerdor-interno-derecho">
          <contador-label class= "default-label" text= "Dias"></contador-label>
            <res-text-input v-model= "dias"></res-text-input>
          <contador-label class= "default-label" text= "Pagar"></contador-label>
            <res-text-input v-model= "pagar"></res-text-input>
        </div>
      </div>
    </div>
  `,
  methods: {
    calcularConsumo: function () {
      var bill_date = new moment();
      var read_date = new moment(this.fechaFactura);
      var days = bill_date.diff(read_date, "days");
      this.dias= days;

      this.promCons = (this.currentCount - this.billCount) / days;
      this.cons = this.currentCount - this.billCount;
      this.estimado = this.promCons * 28;

      this.calcularPago();
    },

    calcularPago: function () {
      var pos = 0;
      var count = 0;
      var pcons = parseInt(this.estimado);
      var pagar= 0;

      for (let index = 0; index < this.buckets.length; index++) {
        this.buckets[index].cont= 0;
      }

      while (pcons != 0) {
        if (count < this.buckets[pos].max) {
          this.buckets[pos].cont++;
          count++;
          pcons--;
        } else {
          pos++;
        }
      }

      for (let index = 0; index < this.buckets.length; index++) {
        if (this.buckets[index].cont != 0) {
          pagar+= this.buckets[index].cont * this.buckets[index].precio;
        }
      }

      this.pagar= pagar;
    },

    setDate: function (fecha) {
      this.fechaFactura = fecha;
    },

    setBillCount: function (count) {
      this.billCount = count;
    },

    setCurrentCount: function (count) {
      this.currentCount = count;
    },
  },
});
