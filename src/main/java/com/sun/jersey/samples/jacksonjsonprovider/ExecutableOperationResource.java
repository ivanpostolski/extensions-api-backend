package com.sun.jersey.samples.jacksonjsonprovider;

import org.mule.extensions.execution.ExecutableConfiguration;
import org.mule.extensions.execution.ExecutableOperation;
import org.mule.extensions.execution.ExecutableOperationBuilder;
import org.mule.extensions.introspection.Configuration;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.Map;

/**
 */
public class ExecutableOperationResource {
    private final Map<String, ExecutableConfiguration> executableConfigurations;
    private final String operationName;
    private final Configuration configuration;

    public ExecutableOperationResource(Map<String, ExecutableConfiguration> executableConfigurations, Configuration configuration, String operation) {
        this.executableConfigurations = executableConfigurations;
        this.operationName = operation;
        this.configuration = configuration;
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public OperationResource get(){
        return new OperationResource(configuration.operation(operationName).get());
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public ExecutionResultResource execute(Map<String,Object> form) throws Exception {
        if (!form.containsKey("id")){
            throw new RuntimeException();
        }

        ExecutableOperationBuilder builder = executableConfigurations.get(form.get("id").toString()).operationBuilder(operationName);
        for (String parameter: form.keySet()) {
            if (!"id".equals(parameter)) builder.addParameter(parameter,form.get(parameter));

        }
        ExecutableOperation executableOperation = builder.build();
        return new ExecutionResultResource(executableOperation.execute().get());
    }
}
