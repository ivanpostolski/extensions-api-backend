package com.test;


import org.mule.extensions.execution.ExecutableConfiguration;
import org.mule.extensions.execution.ExecutableOperation;
import org.mule.extensions.execution.ExecutableOperationBuilder;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.Map;


public class ExecutableConfigurationResource {

    private ExecutableConfiguration executableConfiguration;

    public ExecutableConfigurationResource(ExecutableConfiguration executableConfiguration) {
        this.executableConfiguration = executableConfiguration;
    }

    @POST
    @Path("/execute")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public ExecutionResultResource execute(Map<String,Object> form) throws Exception {
        ExecutableOperationBuilder builder = executableConfiguration.operationBuilder((String)form.get("operation"));
        for (String parameter: form.keySet()) {
            if (!form.get(parameter).equals("operation")) builder.addParameter(parameter,form.get(parameter));
        }
        ExecutableOperation executableOperation = builder.build();
        return new ExecutionResultResource(executableOperation.execute().get());
    }

}
