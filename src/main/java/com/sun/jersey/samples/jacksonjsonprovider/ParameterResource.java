package com.sun.jersey.samples.jacksonjsonprovider;


import org.mule.extensions.introspection.Parameter;

import java.lang.reflect.Type;

public class ParameterResource {

    ParameterResource(Parameter parameter) {
        this.name = parameter.name();
        this.isOptional = parameter.isOptional();
        this.isSensitive = parameter.isSensitive();
        this.type = parameter.type().getType();
    }

    String name;

    Boolean isOptional;

    Boolean isSensitive;

    public Type getType() {
        return type;
    }

    Type type;


    public String getName() {
        return name;
    }

    public Boolean getOptional() {
        return isOptional;
    }

    public Boolean getSensitive() {
        return isSensitive;
    }

}
