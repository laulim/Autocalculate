$(document).ready(function(){

// jQuery - Автокалькулятор

// Задаем переменные
	var modelSpecs,
		modelPrice,
		modelSpecsHolder,
		modelPriceHolder,
		modelPriceUSDHolder;

	modelSpecsHolder = $('#modelSpecs');
	modelPriceHolder = $('#modelPrice');
	modelPriceUSDHolder = $('#modelPriceUSD');
	modelPrice = 0;
	modelSpecs = '';

	// При старте страницы
	calculatePrice();
	compileSpecs();

	// Считает цену при переключении кнопок
	$('#autoForm input').on('change', function(){
		calculatePrice();
		compileSpecs();
		calculateUSD();
	});

	// ВЫБОР ЦВЕТА - на цену не влияет
	$('#colorsSelector').find('.colorItem').on('click', function(){
		var $carImg = $('#imgHolder').find('img');
		var imgPath = $(this).attr('data-img-path');
		$carImg.fadeOut(200, function(){
			$(this).attr('src', imgPath).fadeIn(200);
		});
	});

// Создаем функцию, которая будет считать цену
	function calculatePrice() {
		var modelPricEengine = $('input[name=engine]:checked', '#autoForm').val();
		var modelPricTransmission = $('input[name=transmission]:checked', '#autoForm').val();
		var modelPricPackage = $('input[name=package]:checked', '#autoForm').val();

		modelPricEengine = parseInt(modelPricEengine);
		modelPricTransmission = parseInt(modelPricTransmission);
		modelPricPackage = parseInt(modelPricPackage);

		modelPrice = modelPricEengine + modelPricTransmission + modelPricPackage;
		// alert(modelPrice);

		modelPriceHolder.text(addSpace(modelPrice) + ' рублей');
	};

// Выдает выбранных спецификации
	function compileSpecs(){
		modelSpecs = $('input[name=engine]:checked + label', '#autoForm').text();
		modelSpecs += ', ' + $('input[name=transmission]:checked + label', '#autoForm').text();
		modelSpecs += ', ' + $('input[name=package]:checked + label', '#autoForm').text();
		modelSpecsHolder.text(modelSpecs);
	};

// Ставит пробел в цене
	function addSpace(nStr){
		nStr += '';
		x = nStr.split('.');
		x1 = x[0];
		x2 = x.lenth > 1 ? '.' + x[1] : '';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ' ' + '$2');
		}
		return x1 + x2;
	};

// Получаем курс валют 
	// var currencyUrl = 'https://query.yahooapis.com/v1/public/yql?q=select+*+from+yahoo.finance.xchange+where+pair+=+"USDRUB,EURRUB"&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';
	// var currencyUrl = 'https://www.cbr-xml-daily.ru/daily_eng.xml';
	// var currencyUrl = 'https://www.cbr-xml-daily.ru/daily_json.js';
	// var currencyUrl = 'http://informers.forexpf.ru/php/cbrf.php?id=01';
	// var currencyUrl = 'http://www.profinance.ru/_informer_/chart.php?type=1&wid=240&hig=160';
	// var currencyUrl = 'https://openexchangerates.org/api/latest.json?app_id=80be738e0bc54cd49d335608fd3e8e92';
	var currencyUrl = 'http://api.fixer.io/latest?base=USD';
	var rurUsdRate = 0;

	$.ajax({
		url: currencyUrl,
		cache: false,
		success: function(html){
			//console.log(html.rates.RUB);
			rurUsdRate = html.rates.RUB;
			calculateUSD();
		}
	});

	function calculateUSD(){
		var modelPriceUSD = modelPrice / rurUsdRate;
		//console.log(modelPriceUSD);
		modelPriceUSDHolder.text( '$ ' + addSpace(modelPriceUSD));
	}

});