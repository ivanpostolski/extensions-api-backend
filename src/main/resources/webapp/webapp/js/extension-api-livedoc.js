  //starting point...
  $(function(){
    retrieveConfigs();
    addListeners();
  });

  //global variables
  var _ResourceURL, _JSON, _ConfigurationId;
  _JSON = "";
  _ConfigurationId = "";
  _ResourceURL = "http://localhost:8080/api/sfdc/"


  //Chosen library
  function drawSelectsWithChosen(){
    var config, selector;
    config = {
      '.chosen-select-configurations'   : {},
      '.chosen-select-operations'       : {}
    }
    for (selector in config) {
      $(selector).chosen(config[selector]);
    }
  };

  function redrawSelectWithChosen(selector){
    $(selector).val('').trigger("chosen:updated");
  };

  //linq library
  function getNames(jsonArray){
    return Enumerable.From(jsonArray).Select("$.name").ToArray();
  }

  //drawing modals
  function drawParameterConfigurationModal(selector, parameter, scope){
    var name, type, optional, sensitive, defaultExpression, inputType, generatedHtml;
    var hackishDefaultValue = "";
    name=parameter.name;
    type=parameter.type;
    optional=parameter.optional;
    sensitive=parameter.sensitive;
    defaultExpression = parameter.defaultExpression;

    //TODO remove this later...
    if( name =="username"){ hackishDefaultValue = " value='sap.dev@mulesoft.com.sap' ";} ;
    if( name =="password"){ hackishDefaultValue = " value='Muleftwin4' ";} ;
    if( name =="securityToken"){ hackishDefaultValue = " value='fKESXfSAj43qR6wfxwxotw9Uc' ";} ;
    if( name =="type"){ hackishDefaultValue = " value='ACCOUNT' ";} ;
    if( name =="object"){ hackishDefaultValue = " value=' {\"name\":\"ble\"} ' ";} ;


    inputType = ( sensitive ) ? "password" : "text";
    mandatory = ( optional ) ? "" : "<span style='color:red'> (*)</span>";

    generatedHtml = '<br><div class="form-group">';
    generatedHtml += '  <label class="col-md-4 control-label '+ scope +'-label" for="textinput" style="width:230px;">'+ name + mandatory +'</label>  ';
    generatedHtml += '  <div class="col-md-4">';
    generatedHtml += '    <input id="textinput" name="textinput" ' + hackishDefaultValue + ' placeholder="'+ defaultExpression +'" class="form-control input-md '+ scope +'-input" type="'+ inputType +'" style="width:400px;">';
    generatedHtml += '  </div>';
    generatedHtml += '</div>';

    selector.append(generatedHtml);
  };

  function drawConfigurationModal(json, configuration){
    var selector = $(".modal-body-configuration");
    selector.empty();
    $("#modalTitleConfiguration").text("Editing values for '"+ configuration +"' configuration:");
    $.each(json.parameters, function( index, value ) {
      drawParameterConfigurationModal(selector, value, "configuration");
    });
  }

  function drawOperationModal(json){
    var selector = $(".modal-body-operation");
    selector.empty();
    $("#modalTitleOperation").text("Editing values for '"+ json.name +"' operation:");
    $.each(json.parameters, function( index, value ) {
      drawParameterConfigurationModal(selector, value, "operation");
    });
  }

  function drawDescription(selector, description){
    selector.empty();
    selector.append(description);
  }

  function reDrawSelect(selector, arrayOfOptions ){
    selector.empty();
    selector.append("<option value=''> </option>");
    $.each(arrayOfOptions, function( index, value ) {
      selector.append("<option value='"+ value +"'> "+ value +" </option>");
    });
  };

  function populateConfigs(json){
    selector_configurations = $(".configurations");
    reDrawSelect(selector_configurations, getNames(json.configurations) );

    addConfigurationListener(selector_configurations);
    drawSelectsWithChosen();
  };

  function populateOperations(json){
    selector_operations = $(".operations");
    reDrawSelect(selector_operations, getNames(json.operations) );

    redrawSelectWithChosen(selector_operations);
    addOperationListener(selector_operations);

  };

  //API
  function retrieveConfigs(){
    $.getJSON( _ResourceURL, function(data) {
      populateConfigs(data);
    })
    .fail(function() {
      console.log( "error" );
    });
  };

  function retrieveOperations(configuration){
    $.getJSON( _ResourceURL + configuration, function(data) {
        drawConfigurationModal(data, configuration);
        drawDescription($(".configurationDescription"), data.description);
        populateOperations(data);
        _JSON = data; //TODO .. there should be a way to retrieve information regarding just an operation...
    })
    .fail(function() {
      console.log( "error" );
    });
  };

  //add listeners
  function addButtonModalListener(){
    $(".configuration-modal-button").click(function(){
      if ($(".configurations").val() === ""){
        noty({text: 'Please, select a configuration', timeout:3000, type: 'warning'});
      } else {
        $("#modalConfiguration").modal('show');
      };
    });

    $(".operation-modal-button").click(function(){
      if ($(".operations").val() === ""){
        noty({text: 'Please, select an operation', timeout:3000, type: 'warning'});
      } else {
        $("#modalOperation").modal('show');
      };
    });


  }
  function addConfigurationListener(aSelectConfigurations){
    aSelectConfigurations.change( function () {
      retrieveOperations(aSelectConfigurations.val());
    });
  };

  function addOperationListener(aSelectOperations){
    aSelectOperations.change( function () {
      var operation;
      operation = Enumerable.From(_JSON.operations).Where("$.name == '" + aSelectOperations.val() +"'").First();

      drawDescription($(".operationDescription"), operation.description);
      drawOperationModal(operation);
      console.log ("selected operation:" + operation.name);
    });
  };

  function addModalConfigurationModalListener(){
    $(".btn-primary-configuration").click(function(){
      var configurationLabelsSelector, configurationInputsSelector, configurationParameters;

      configurationLabelsSelector = $(".configuration-label");
      configurationInputsSelector = $(".configuration-input");
      configurationParameters = '';

      for (var i=0;i<configurationInputsSelector.length;i++) {
        if (configurationInputsSelector[i].value !== ""){
          configurationParameters += '"' + configurationLabelsSelector[i].firstChild.data +'":"' + configurationInputsSelector[i].value + '",';
        }
      };
      if (configurationParameters.length > 0){//removing last comma
        configurationParameters = configurationParameters.substring(0, configurationParameters.length - 1);
      };
      configurationParameters = '{' + configurationParameters + '}';

      $("#modalConfiguration").modal('hide');
      // TODO not working because of cors.... :(
      $.ajax({
          type: "POST",
          url: _ResourceURL + $(".configurations").val(),
          dataType: 'json',
          contentType: 'application/json',
          async: false,
          data: JSON.stringify(JSON.parse(configurationParameters)),
          success: function (data, textStatus, jqXHR) {
            _ConfigurationId = data;
            console.log("Configuration id:" + _ConfigurationId);
          }
      });
    });
  };

  function addModalOperationModalListener(){
      $(".btn-primary-operation").click(function(){
        var configurationLabelsSelector, configurationInputsSelector, operationParameters;

        configurationLabelsSelector = $(".operation-label");
        configurationInputsSelector = $(".operation-input");
        if(_ConfigurationId == ""){
            noty({text: 'There is (yet) no configuration available, please, load a configuration first', timeout:3000, type: 'warning'});
            return;
        }
        operationParameters = '"id":"' + _ConfigurationId + '",';

        for (var i=0;i<configurationInputsSelector.length;i++) {
          if (configurationInputsSelector[i].value !== ""){
            var value ='"' + configurationInputsSelector[i].value + '"';
            try {
                value = JSON.stringify($.parseJSON(configurationInputsSelector[i].value));
            } catch (e) {
                // not json
            }

            operationParameters += '"' + configurationLabelsSelector[i].firstChild.data +'": ' + value + ',';
//            operationParameters += '"' + configurationLabelsSelector[i].firstChild.data +'":"' + configurationInputsSelector[i].value + '",';
          }
        };
        if (operationParameters.length > 0){//removing last comma
          operationParameters = operationParameters.substring(0, operationParameters.length - 1);
        };
        operationParameters = '{' + operationParameters + '}';
        console.log("Operations json:" + operationParameters);
        $("#modalConfiguration").modal('hide');
        // TODO not working because of cors.... :(
        $.ajax({
            type: "POST",
            url: _ResourceURL + $(".configurations").val() + "/" + $(".operations").val(),
            dataType: 'json',
            contentType: 'application/json',
            async: false,
            data: JSON.stringify(JSON.parse(operationParameters)),
            success: function (data, textStatus, jqXHR) {
              console.log("Operation status:" + data.status);
              console.log("Operation status:" + data.status);
            }
        });
      });
    };

  function addListeners(){
    addModalConfigurationModalListener();
    addModalOperationModalListener();
    addButtonModalListener();
  };


