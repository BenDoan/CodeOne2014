function logScatalystValuesToFirebugConsole(title) {
  if(typeof console !== "undefined") {
    if(typeof console.log !== "undefined") {
      console.log('------- '+title);
      console.log('-------');
      console.log('scatalyst.pageName='+scatalyst.pageName);
      console.log('scatalyst.channel='+scatalyst.channel);
      console.log('scatalyst.prop1='+scatalyst.prop1);
      console.log('scatalyst.prop2='+scatalyst.prop2);
      console.log('scatalyst.prop23='+scatalyst.prop23);
      console.log('scatalyst.prop9='+scatalyst.prop9);
      console.log('scatalyst.prop10='+scatalyst.prop10);
      console.log('scatalyst.eVar25='+scatalyst.eVar25);
      console.log('scatalyst.events='+scatalyst.events);
    }
  }
}
