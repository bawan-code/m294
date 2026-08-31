package ch.mahmud.bawan.job_marketplace.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class OpenApiController {
    @RequestMapping("/")
    public String home() {
        return "redirect:/swagger-ui.html";
    }
}