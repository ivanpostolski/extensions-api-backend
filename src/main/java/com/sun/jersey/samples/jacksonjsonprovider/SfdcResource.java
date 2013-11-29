package com.sun.jersey.samples.jacksonjsonprovider;

import org.mule.extensions.introspection.MuleExtension;
import org.mule.modules.salesforce.extension.SfdcMuleExtension;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;


@Path("/sfdc")
public class SfdcResource {

    MuleExtension extension = new SfdcMuleExtension();

    @Path("/config")
    @Produces(MediaType.APPLICATION_JSON)
    public ConfigurationResource config(){
        return new ConfigurationResource(extension.configurations().get(0));
    }

    @Path("/oauth")
    @Produces(MediaType.APPLICATION_JSON)
    public ConfigurationResource oauth(){
        return new ConfigurationResource(extension.configurations().get(1));
    }


}
