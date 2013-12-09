package com.sun.jersey.samples.jacksonjsonprovider;

import org.mule.extensions.introspection.Configuration;
import org.mule.extensions.introspection.MuleExtension;

import java.util.ArrayList;
import java.util.List;

public class MuleExtensionResource {

    public MuleExtensionResource(MuleExtension extension) {
        configurations = new ArrayList<ConfigurationResource>();
        for (Configuration configuration : extension.configurations()){
            configurations.add(new ConfigurationResource(configuration));
        }
    }

    public List<ConfigurationResource> getConfigurations() {
        return configurations;
    }

    private List<ConfigurationResource> configurations;

}
