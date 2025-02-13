package com.gestion.orphelins.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.gestion.orphelins.services.interfaces.StatistiquesInterface;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;

@RestController // Marks this class as a RESTful controller.
@RequestMapping("/api/statistiques") // Maps all HTTP requests to this controller to the /api/don path.
@RequiredArgsConstructor
public class StatistiquesControler {
    private final StatistiquesInterface statistiquesService;

    @GetMapping
    public Map<String, Object> getStatistiquesGlobales() {
        return statistiquesService.genererStatistiquesGlobales();
    }

}
