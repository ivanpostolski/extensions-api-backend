package com.sun.jersey.samples.jacksonjsonprovider;


import org.mule.extensions.introspection.Operation;
import org.mule.extensions.introspection.Parameter;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class OperationResource {

    public OperationResource(Operation operation) {
        this.name = operation.name();
        this.description = operation.description().orNull();
        this.parameters = new ArrayList<ParameterResource>();
        for (Parameter p: operation.parameters()) {
            this.parameters.add(new ParameterResource(p));
        }
    }

    String name;

    String description;

    List<ParameterResource> parameters;

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public List<ParameterResource> getParameters() {
        return parameters;
    }
}
