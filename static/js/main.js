$(".budget-range").mousemove( function(e){
    console.out("Changing valBox" + $(this).attr("name"));
    $("#valBox" + $(this).attr("name")).html($(this).val());
});

$(".budget-range").mouseleave( function(e){
    $.post("/budget_val_ingest", {name: $(this).attr("name"), value: $(this).val()});
    d3.json("bucket-values.json", function(data){
        nv.addGraph(function() {
          var chart = nv.models.pieChart()
              .x(function(d) { return d.label })
              .y(function(d) { return d.value })
              .showLabels(true)
              .labelThreshold(.05)
              .labelType("percent")
              .donut(true)
              .donutRatio(0.35)
              .color(function(d){return d.data.color})
              ;

            d3.select("#chart2 svg")
                .datum(data)
                .transition().duration(350)
                .call(chart);

          return chart;
        });
    });
});

d3.json("bucket-values.json", function(data){
    nv.addGraph(function() {
      var chart = nv.models.pieChart()
          .x(function(d) { return d.label })
          .y(function(d) { return d.value })
          .showLabels(true)
          .labelThreshold(.05)
          .labelType("percent")
          .donut(true)
          .donutRatio(0.35)
          .color(function(d){return d.data.color})
          ;

        d3.select("#chart2 svg")
            .datum(data)
            .transition().duration(350)
            .call(chart);

      return chart;
    });
});

nv.addGraph(function() {
    var chart = nv.models.cumulativeLineChart()
                  .x(function(d) { return d[0] })
                  .y(function(d) { return d[1] })
                  .color(d3.scale.category10().range())
                  .useInteractiveGuideline(true)
                  ;

     chart.xAxis
        .tickFormat(function(d) {
            return d3.time.format('%x')(new Date(d))
      });

    chart.yAxis
        .tickFormat(d3.format('+$,.2f'));

    d3.select('#loanchart svg')
        .datum(getLoanData())
        .call(chart);

    //TODO: Figure out a good way to do this automatically
    nv.utils.windowResize(chart.update);

    return chart;
});

d3.json("month-transactions-per-bucket.json", function(data){
    nv.addGraph(function() {
        var chart = nv.models.cumulativeLineChart()
                      .x(function(d) { return d[0] })
                      .y(function(d) { return d[1] })
                      .color(d3.scale.category10().range())
                      .useInteractiveGuideline(true)
                      ;

         chart.xAxis
            .tickFormat(function(d) {
                return d3.time.format('%x')(new Date(d))
          });

        chart.yAxis
            .tickFormat(d3.format('+$,.2f'));

        d3.select('#chart svg')
            .datum(data)
            .call(chart);

        //TODO: Figure out a good way to do this automatically
        nv.utils.windowResize(chart.update);

        return chart;
    });
})


d3.json("dailyhist",function(data){
  nv.addGraph(function() {
    var chart = nv.models.multiBarChart()
      .transitionDuration(350)
      .reduceXTicks(false)   //If 'false', every single x-axis tick label will be rendered.
      .rotateLabels(-30)      //Angle to rotate x-axis labels.
      .showControls(true)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
      .groupSpacing(0.1)    //Distance between each group of bars.
      .color(function(d){
        return d.color;
      })
    ;
    /*var chart = nv.models.cumulativeLineChart()
                  .x(function(d) { return d[0] })
                  .y(function(d) { return d[1]/100 }) //adjusting, 100% is 1.00, not 100 as it is in the data
                  .color(d3.scale.category10().range())
                  .useInteractiveGuideline(true)
                  ;*/

     chart.xAxis
//        .tickValues([1078030800000,1122782400000,1167541200000,1251691200000])
        .tickFormat(function(d) {
            return d3.time.format('%x')(new Date(d*1000))
          });

    chart.yAxis
        .tickFormat(d3.format('$,1'));
    d3.select('#hist svg')
        .datum(data)
        .call(chart);

    //TODO: Figure out a good way to do this automatically
    nv.utils.windowResize(chart.update);

    return chart;
  });
});

function exampleData() {
    return [{"label": "DOUBLETREE HOTELS", "value": 120.34}, {"label": "Roofing,Sheet Metal Work, Siding Contractors", "value": 220.0}, {"label": "Direct Marketing ? Catalog Merchant", "value": 553.93}, {"label": "Theatrical Producers (except Motion Pictures)", "value": 56.0}, {"label": "Artist?s Supply and Craft Shops", "value": 104.72}, {"label": "Grocery Stores/Supermarkets", "value": 1626.59}, {"label": "Professional Services-not Elsewhere Classified", "value": 210.0}]
}

function  getLoanData(){
    return [{"key": "Honda Civic 2010", "values": [[1383454800000, 20000], [1383454900000, 15000], [1383455000000, 14000], [1383455100000, 10000]]}, {"key": "1234 456 Lane", "values": [[1383454800100, 20000]]}, {"key": "Honda Civic 2011", "values" :[[1383454850100, 17000]]}]

}
