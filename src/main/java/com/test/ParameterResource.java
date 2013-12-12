package com.test;


import org.mule.extensions.introspection.Parameter;

import java.lang.reflect.Type;

public class ParameterResource {

    ParameterResource(Parameter parameter) {
        this.name = parameter.name();
        this.isOptional = parameter.isOptional();
        this.isSensitive = parameter.isSensitive();
        if (parameter.defaultExpression().isPresent()){
            defaultExpression = parameter.defaultExpression().get();
        }else {
            defaultExpression = "";
        }
        this.type = parameter.type().getRawType().getName();
    }

    String name;

    Boolean isOptional;

    Boolean isSensitive;

    String defaultExpression;

    String type;
    
    public String getType() {
        return type;
    }

    public String getName() {
        return name;
    }

    public Boolean getOptional() {
        return isOptional;
    }

    public Boolean getSensitive() {
        return isSensitive;
    }

    public String getDefaultExpression() {
        return defaultExpression;
    }

}
