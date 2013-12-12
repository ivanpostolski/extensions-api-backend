  //starting point...
  $(function(){
    retrieveConfigs();
    addListeners();
  });

  //global variables
  var _ResourceURL, _JSON;
  _JSON = "";
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
  function drawParameterConfigurationModal(selector, parameter){
    var name, type, optional, sensitive, defaultExpression, inputType, generatedHtml;
    name=parameter.name;
    type=parameter.type;
    optional=parameter.optional;
    sensitive=parameter.sensitive;
    defaultExpression = parameter.defaultExpression;


    inputType = ( sensitive ) ? "password" : "text";
    mandatory = ( optional ) ? "" : "<span style='color:red'> (*)</span>";

    generatedHtml = '<br><div class="form-group">';
    generatedHtml += '  <label class="col-md-4 control-label configuration-label" for="textinput" style="width:230px;">'+ name + mandatory +'</label>  ';
    generatedHtml += '  <div class="col-md-4">';
    generatedHtml += '    <input id="textinput" name="textinput" placeholder="'+ defaultExpression +'" class="form-control input-md configuration-input" type="'+ inputType +'" style="width:400px;">';
    generatedHtml += '  </div>';
    generatedHtml += '</div>';

    selector.append(generatedHtml);
  };

  function drawConfigurationModal(json, configuration){
    var selector = $(".modal-body-configuration");
    selector.empty();
    $("#modalTitleConfiguration").text("Editing values for '"+ configuration +"' configuration:");
    $.each(json.parameters, function( index, value ) {
      drawParameterConfigurationModal(selector, value);
    });
  }

  function drawOperationModal(json){
    var selector = $(".modal-body-operation");
    selector.empty();
    $("#modalTitleOperation").text("Editing values for '"+ json.name +"' operation:");
    $.each(json.parameters, function( index, value ) {
      drawParameterConfigurationModal(selector, value);
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
    $(".btn-primary-configurations").click(function(){
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
          url: _ResourceURL + 'config',
          dataType: 'json',
          async: false,
          data: JSON.stringify(JSON.parse(configurationParameters)),
          success: function (data, textStatus, jqXHR) {
            alert("ID:" + data);
          }
      });
    });
  };

  function addListeners(){
    addModalConfigurationModalListener();
    addButtonModalListener();
  };


