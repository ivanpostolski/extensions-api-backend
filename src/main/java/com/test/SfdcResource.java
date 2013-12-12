package com.test;

import org.mule.extensions.introspection.MuleExtension;
import org.mule.modules.salesforce.extension.SfdcMuleExtension;
import org.springframework.stereotype.Component;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;
import java.io.File;

@Component
@Path("/sfdc")
public class SfdcResource {

    MuleExtension extension = new SfdcMuleExtension();

    @GET
    @Produces(value = "application/json")
    public MuleExtensionResource getConfigs(@Context UriInfo ui){
           return new MuleExtensionResource(extension);
    }

    @GET
    @Path("/index")
    @Produces(MediaType.TEXT_HTML)
    public Response index(){
        File html = null;
        return Response.ok(html, "text/html").build();
    }

    @Path("/config")
    @Produces(MediaType.APPLICATION_JSON)
    public ConfigurationResource config(){
        return new ConfigurationResource(extension.configurations().get(0));
    }

    @Path("/config-with-oauth")
    @Produces(MediaType.APPLICATION_JSON)
    public ConfigurationResource oauth(){
        return new ConfigurationResource(extension.configurations().get(1));
    }


}
