package com.sun.jersey.samples.jacksonjsonprovider;


import org.mule.extensions.execution.ConfigurationBuilder;
import org.mule.extensions.execution.ExecutableConfiguration;
import org.mule.extensions.introspection.Configuration;
import org.mule.extensions.introspection.Operation;
import org.mule.extensions.introspection.Parameter;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.*;

public class ConfigurationResource {

    private Configuration configuration;

    public static Map<String,ExecutableConfiguration> executableConfigurations = new HashMap<String, ExecutableConfiguration>();

    public ConfigurationResource(Configuration configuration) {
        this.configuration = configuration;
        this.name = configuration.name();
        this.description = configuration.description().orNull();
        this.parameters = new ArrayList<ParameterResource>();
        for (Parameter p: configuration.parameters()) {
            this.parameters.add(new ParameterResource(p));
        }
        this.operations = new ArrayList<OperationResource>();
        for (Operation op: configuration.operations()) {
            this.operations.add(new OperationResource(op));
        }
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public String builder(Map<String, String> parameters) {
        ConfigurationBuilder builder = configuration.builder();
        for (String key: parameters.keySet()) {
            builder.addParameter(key,parameters.get(key));
        }
        UUID id = UUID.randomUUID();
        executableConfigurations.put(id.toString(),builder.build());
        return id.toString();
    }

    @Path("/instance/{id}")
    public ExecutableConfigurationResource search(@PathParam(value = "id") String id){
        return new ExecutableConfigurationResource(executableConfigurations.get(id));
    }

    @Path("/{operation}")
    public ExecutableOperationResource operation(@PathParam(value = "operation") String operation){
        return new ExecutableOperationResource(executableConfigurations,configuration,operation);
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public ConfigurationResource show() {
        return this;
    }

    String name;

    String description;

    List<ParameterResource> parameters;

    List<OperationResource> operations;

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public List<ParameterResource> getParameters() {
        return parameters;
    }

    public List<OperationResource> getOperations() {
        return operations;
    }

}
