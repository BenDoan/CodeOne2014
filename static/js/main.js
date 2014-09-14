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

return [{'key': 'Series 1', 'values': [[1383454800000, 164.64000000000001], [1383544800000, -54.88], [1383631200000, 216.70999999999998], [1383717600000, 223.92999999999998], [1383804000000, 386.5], [1383890400000, 211.2], [1383976800000, 522.24], [1384063200000, 52.22], [1384149600000, 300.45], [1384236000000, -58.37], [1384408800000, 877.3399999999999], [1384495200000, 802.14], [1384581600000, 29.9], [1384668000000, 30.58], [1384840800000, 343.05], [1385013600000, 181.38], [1385359200000, 96.00999999999999], [1385964000000, 140.82], [1386050400000, 23.18], [1386136800000, 40.7], [1386223200000, 194.68], [1386309600000, -4918.07], [1386482400000, 31.46], [1386568800000, 110.73], [1386655200000, 117.66999999999999], [1386828000000, 209.17], [1386914400000, 21.29], [1387000800000, 117.39], [1387173600000, 29.9], [1387346400000, 35.0], [1387519200000, 215.26000000000002], [1387605600000, 153.09], [1387864800000, 119.97], [1388037600000, 324.44], [1388210400000, 50.0], [1388296800000, 175.0], [1388642400000, 125.81], [1388728800000, -2057.62], [1388815200000, 380.8], [1389074400000, 104.97], [1389506400000, 151.7], [1389592800000, 309.99], [1389679200000, 190.91], [1389852000000, 97.28], [1389938400000, 26.61], [1390197600000, 38.21], [1390284000000, 158.4], [1390370400000, 184.89999999999998], [1390456800000, 94.07], [1390543200000, -664.1100000000001], [1390629600000, 49.85], [1390716000000, 265.25], [1390802400000, 101.52000000000001], [1390888800000, 54.0], [1390975200000, 41.0], [1391148000000, 565.19], [1391234400000, 442.96], [1391320800000, 115.85], [1391752800000, 87.74], [1391925600000, 60.02], [1392098400000, 232.87], [1392184800000, 108.44], [1392271200000, 202.84], [1392530400000, 95.96000000000001], [1392616800000, 579.78], [1392703200000, 374.9], [1392789600000, 45.0], [1392876000000, 153.65], [1392962400000, 37.0], [1393221600000, 282.73], [1393308000000, 25.94], [1393394400000, 337.9], [1393480800000, 2.99], [1393567200000, 9.97], [1393740000000, 28.86], [1393826400000, 354.75], [1393912800000, -5488.15], [1393999200000, 42.84], [1394085600000, 199.95], [1394258400000, 179.0], [1394344800000, 179.0], [1394514000000, 59.99], [1394600400000, 100.72], [1394773200000, 39.95], [1394946000000, 29.9], [1395205200000, 38.75], [1395378000000, 42.32], [1395810000000, 38.87], [1396328400000, -81.0], [1396414800000, 54.53], [1396501200000, -345.98], [1396587600000, 84.74], [1396760400000, 157.34], [1396846800000, 31.88], [1397278800000, 110.71], [1397451600000, 471.64], [1397624400000, 29.9], [1397710800000, 143.0], [1397970000000, 5.99], [1398142800000, 39.99], [1398315600000, 65.49000000000001], [1398574800000, 77.18], [1398747600000, 64.0], [1398834000000, -2089.24], [1398920400000, 37.2], [1399006800000, 143.76999999999998], [1399266000000, 111.10000000000001], [1399438800000, 165.78], [1399525200000, 91.24000000000001], [1399611600000, 244.74], [1399784400000, 269.34], [1399870800000, 170.7], [1400043600000, 171.95], [1400130000000, 137.87], [1400216400000, 29.9], [1400475600000, 55.61], [1401080400000, 24.73], [1401166800000, 689.6], [1401253200000, 214.18], [1401339600000, 300.75], [1401426000000, -2821.31], [1401598800000, 38.07], [1401685200000, 16.86], [1401771600000, 4.16], [1402030800000, 56.0], [1402203600000, 488.62], [1402290000000, 391.03000000000003], [1402376400000, 9.79], [1402462800000, 19.92], [1402549200000, 136.53], [1402635600000, 813.9300000000001], [1402808400000, 64.74000000000001], [1402894800000, 79.96], [1402981200000, 390.62], [1403067600000, 162.12], [1403499600000, 200.0], [1403586000000, 149.97], [1403672400000, 51.39], [1403845200000, 110.0], [1403931600000, 3.98], [1404018000000, 88.02], [1404104400000, -3075.4], [1404190800000, 4.0], [1404277200000, 185.51999999999998], [1404363600000, 100.03], [1404709200000, 34.14], [1404795600000, 43.760000000000005], [1404882000000, 11.87], [1404968400000, 61.82], [1405054800000, 842.89], [1405141200000, 90.73], [1405227600000, 79.29], [1405314000000, 106.43], [1405486800000, 107.85], [1405832400000, 172.48], [1405918800000, 310.95], [1406005200000, 108.75], [1406091600000, -431.88], [1406178000000, 61.78], [1407646800000, 261.28], [1407733200000, 109.16000000000001], [1408078800000, 38.87], [1408165200000, 39.02], [1408856400000, 14.57], [1409115600000, 12.74], [1409202000000, 1.0], [1409634000000, 25.0], [1410843600000, 32.44]]}]

}
