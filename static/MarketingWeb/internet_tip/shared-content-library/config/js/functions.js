function popWin(url,width,height) {
	open (url,"NewWindow", "scrollbars=yes,menubar=no,resizable=1,copyhistory=1,width=" + width + ",height=" + height);
}
function getSSL(page) {
	return "https://" + window.location.hostname + page;
}
function getSSLOpen(page) {
	window.location=("https://" + window.location.hostname + page);
}
function getSSLPop(page) {
	window.open("https://" + window.location.hostname + page);
}
function siteDisclosure( linktype, ourSite, newSite, newSiteURL, newWindow ){
	switch ( linktype ) {
		// Linking to an FNNI family site
		case "website":
			confirmValue = confirm( "Thanks for visiting " + ourSite + ".  You are now leaving our website.  Please be aware that any products and services accessed through this website are not provided by " + ourSite + ".  " + newSite + " may have a privacy policy and security policy that are different from " + ourSite + ".  Please review " + newSite + "'s privacy and security policies." );
			break;
	}//end switch
	if ( confirmValue ) {
		if ((newWindow != "yes") && (newWindow !="true")){
			document.location=newSiteURL;
		}//end nested if
		else {
			window.open(newSiteURL);
		}//end else
	}//end if
}//end siteDisclosure

function FooterDate()
{
	var ftrDate=new Date();
	var ftrYear=ftrDate.getYear();
	if (ftrYear < 1000) {
		ftrYear = ftrYear + 1900;
	}
	document.write(ftrYear);
}

sendAjaxRequestForRatesData=function(getOrPost, urlToAccess, dataType, isCache, field_id, successFunction, failureFunction) {
	$.ajax({
		type: getOrPost,
		url: urlToAccess,
		dataType: dataType,
		cache:isCache,
		success:function(xml){
			//alert(successFunction);
			successFunction(xml,field_id);
		},
		error:function(jqXHR, textStatus, errorThrown){
			if((jqXHR.status == 404)&&(! typeof failureFunction==='undefined')){
				//XML file not found. Move to build next rates table if there are any.
				failureFunction;
			}
			else
				//unexpected error. Do not proceed to build more tables.
				return;
		}
	});
};

function ratesDateSuccess(xml,field_id){
	$(field_id).html($(xml).find("RATE_UPLOAD_DATE").text().split(" ")[0]);
}

function ratesAPYSuccess(xml,field_id){
	field_name=field_id.substring(1);
	
	$(xml).find("PRODUCT").each(function () {
		if(field_name=="cd-apy"){
			if($(this).find("ACCT_TYPE").text()=="60 Month"){
				$(field_id).html($(this).find("APY").text().slice(0,-1));
			}
		}else if(field_name=="savings-apy"){
			$(field_id).html($(this).find("APY").text().slice(0,-1));
		}else if(field_name=="checking-apy"){
			$(field_id).html($(this).find("APY").text().slice(0,-1));
		}
	});
}

function CDSuccess(xml){
	var tableCDHeaderCode="<table class='branded'> <thead> <tr> <th class='first'>If your account is a:</th> <th>The interest rate on your account will be:</th> <th>With an annual percentage yield*** of:</th>  </tr> </thead>";
	
	var toDisplay=$(xml).find("DISPLAY_THIS_RATE").text();
	toDisplay=toDisplay.toLowerCase();
	if(( toDisplay=="yes" || toDisplay=="true" || toDisplay=="show")){
		buildCDTableStructure();
		var x=1;
	 	var groupName="";
	 	var countVariableRateAccounts=0;
	 	var countAddOnAccounts=0;
	 	var singleTableCodePerGroup;
	 	$(xml).find("GROUP").each(function () {
	 		//groupName=$(this).find("NAME").text();
	 		//singleTableCodePerGroup="<strong>"+groupName+"</strong>";
	 		singleTableCodePerGroup=tableCDHeaderCode+"<tbody>";
	 		$(this).find("PRODUCT").each(function () {
	 			var accountConstraints="";
	 			var account_type=$(this).find("ACCT_TYPE").text();
	 			if($(this).find("VARIABLE_RATE").text()=="Yes"){
	 				countVariableRateAccounts++;
	 				account_type="<span class='notification-ref cross'>"+account_type+"</span>";
	 			}
	 			if($(this).find("ADD_ON_ACCT").text()=="Yes"){
	 				countAddOnAccounts++;
	 				account_type="<span class='notification-ref double-dagger'>"+account_type+"</span>";
	 			}
	 			if($(this).find("OPTIONAL_CONSTRAINTS").length>0){
					var alphaNumericPattern=/[0-9a-zA-Z]/;
					if($(this).find("OPTIONAL_CONSTRAINTS").text().search(alphaNumericPattern)!=-1)
						accountConstraints="<span class='description'>("+$(this).find("OPTIONAL_CONSTRAINTS").text()+")</span>";
				}
	 			if (x%2==1)
			 	{
			 		singleTableCodePerGroup=singleTableCodePerGroup+"<tr class='odd'><td class='cd-type'>"+account_type+accountConstraints+"</td><td class='rate'>"+$(this).find("RATE").text()+"</td><td class='apy'>"+$(this).find("APY").text()+"</td></tr>";
			  	}
	    		else
			  	{
			  		singleTableCodePerGroup=singleTableCodePerGroup+"<tr class='even'><td class='cd-type'>"+account_type+accountConstraints+"</td><td class='rate'>"+$(this).find("RATE").text()+"</td><td class='apy'>"+$(this).find("APY").text()+"</td></tr>";
			  	}
			  	x++;
	 		});
	 		singleTableCodePerGroup=singleTableCodePerGroup+"</tbody></table>";
	 		$("#allCDRates").append(singleTableCodePerGroup);
	 	});
	 	var staticCDVarRateStuff="";
	 	var staticCDAddOnAcctStuff="";
	 	if(countVariableRateAccounts>0)
	 		staticCDVarRateStuff="<div class='notification cross'>Rates may change after the account is opened.</div>";
		if(countAddOnAccounts>0)
			staticCDAddOnAcctStuff="<div class='notification double-dagger'>The account is an add-on account.</div>";
		//staticCDStuffAfterRevDateDisplay=staticCDVarRateStuff+staticCDAddOnAcctStuff+staticCDStuffAfterRevDateDisplay;
		//$("#revisionDateCD").html(staticCDStuffBeforeRevDateDisplay+$(xml).find("RATE_UPLOAD_DATE").text().split(" ")[0]+". &nbsp;A penalty may be imposed for early withdrawal. &nbsp;Fees may reduce earnings on the account.</div>"+staticCDStuffAfterRevDateDisplay);
	}
}

function buildCDTableStructure() {
	var toggleCDRates;
	toggleCDRates='<div id="allCDRates"></div><div id="revisionDateCD"></div>';
	$('.cdDisclosureRates').append(toggleCDRates);
}

var Rates={};

//mortgagebot nugget global map
Rates.mortgageBotNuggetMap={"castle":"castlebank",
							"colorado":"1stnationalbank",
							"default":"firstnational1",
							"kansas":"fnbk",
							"omaha":"firstnational1",
							"southwest":"jpayne-firstnational1lo",
							"shelby":"scsbnet.com"};

Rates.rateMap={1:"15 Year Fixed Rate",
			   2:"30 Year Fixed Rate",
			   3:"FHA 30 Year Fixed Rate"};

Rates.brandCode="";
Rates.protocolType="";
Rates.mortgageBotNugget="";
Rates.rateToDisplay="";

//BrandCode is passed as an argument to startMortgageRatesLoading.
//startMortgageRatesLoading is called from the marketing side in mortgage-loans.fhtml.
//brandCode is derived from brandPrime's mortgageBotBrandCode property.
//brandCode should be the folder name of the branch.
//mortgageBotNugget is determined in this code based on the brandCode.
//See Rates.mortgageBotNuggetMap above.
function startMortgageRatesLoading(brandCode,displayRate,isLocal){
	if(typeof isLocal==='undefined')
		Rates.protocolType="https";
	else{
		if(isLocal=='true')
			Rates.protocolType="http";
		else
			Rates.protocolType="https";
	}
	
	Rates.rateToDisplay=Rates.rateMap[displayRate];
	Rates.brandCode=brandCode;
	Rates.mortgageBotNugget=getMortgageBotNugget(brandCode);
		
	if(brandCode=='kansas' || brandCode=='default' || brandCode=='omaha' || brandCode=='castle' || brandCode=='colorado' || brandCode=='southwest' || brandCode=='shelby')
		callMortgageRatesXML("bot");
	else
		callMortgageRatesXML("xml");	
}

function getMortgageBotNugget(nugget){
	var found=false;
	var value;
	for(mortgageKey in Rates.mortgageBotNuggetMap){
		if(mortgageKey==nugget){
			found=true;
			value=Rates.mortgageBotNuggetMap[mortgageKey];
		}
	}
	if(!found)
		value="firstnational1";
	Rates.mortgageBotNugget=value;
	return value;
}

function callMortgageRatesXML(mode) {		
	
	var cache=true;
	if(mode=='bot')
		url="/RetailWeb/"+Rates.brandCode+"/rates/mortgage-bot";
	else{
		url="/RetailStatic/"+Rates.brandCode+"/rates/mortgageRates.xml";
		cache=false;
	}

	$.ajax({
		type: "GET",
		url: url,
		dataType: "xml",
		cache:cache,
		success:function(xml){
			mortgageRatesSuccess(xml);
		},
		error:function(jqXHR, textStatus, errorThrown){
			if((jqXHR.status == 404)&&(! typeof failureFunction==='undefined')){
				//XML file not found.
			}
			else
				//unexpected error. Do not proceed to build more tables.
				return;
		}
	});
}

function mortgageRatesSuccess(xml){
	var mortgageBotNugget=Rates.mortgageBotNugget;
	var toDisplay="";
	if(! ($(xml).find("DISPLAY_THIS_RATE").length>0)){
		toDisplay="yes";
	}
	else
		toDisplay=$(xml).find("DISPLAY_THIS_RATE").text();
	
	toDisplay=toDisplay.toLowerCase();
	
	if(( toDisplay=="yes" || toDisplay=="true" || toDisplay=="show")){
		var rate_link;
		var new_rate_link;
		$(xml).find("PRODUCT").each(function () {
			$(".mortgage_rate_date").html($(xml).find("RATE_UPLOAD_DATE").text().split(" ")[0]);
			if($(this).find("DESCR").text()==Rates.rateToDisplay) {
				$("#banner-rate").html($(this).find("RATE").text() + "% ");
			}
		});
	}
}