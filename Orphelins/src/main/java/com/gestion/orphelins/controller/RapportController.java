package com.gestion.orphelins.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.gestion.orphelins.services.interfaces.RapportInterface;
import com.gestion.orphelins.dto.request.requestRapport;
import com.gestion.orphelins.dto.response.responseRapport;
import javax.validation.Valid;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/rapport")
@RequiredArgsConstructor
public class RapportController {
    private final RapportInterface rapportService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> creerRapport(@Valid @RequestBody requestRapport request) {
        responseRapport response = rapportService.creerRapport(request);
        Map<String, Object> responseMap = new HashMap<>();
        responseMap.put("status", "success");
        responseMap.put("message", "Rapport créé avec succès");
        responseMap.put("data", response);
        return ResponseEntity.ok(responseMap);
    }

    @GetMapping("/{id}")
    public ResponseEntity<responseRapport> getRapportById(@PathVariable Long id) {
        return ResponseEntity.ok(rapportService.getRapportById(id));
    }

    @GetMapping
    public ResponseEntity<List<responseRapport>> getAllRapports() {
        return ResponseEntity.ok(rapportService.getAllRapports());
    }

    @GetMapping("/page")
    public ResponseEntity<Page<responseRapport>> getAllRapportsPagines(Pageable pageable) {
        return ResponseEntity.ok(rapportService.getAllRapports(pageable));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateRapport(@PathVariable Long id,
            @Valid @RequestBody requestRapport request) {
        responseRapport response = rapportService.updateRapport(id, request);
        Map<String, Object> responseMap = new HashMap<>();
        responseMap.put("status", "success");
        responseMap.put("message", "Rapport mis à jour avec succès");
        responseMap.put("data", response);
        return ResponseEntity.ok(responseMap);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteRapport(@PathVariable Long id) {
        rapportService.deleteRapport(id);
        Map<String, String> responseMap = new HashMap<>();
        responseMap.put("status", "success");
        responseMap.put("message", "Rapport supprimé avec succès");
        return ResponseEntity.ok(responseMap);
    }

    @GetMapping("/activite/{activiteId}")
    public ResponseEntity<responseRapport> genererRapportActivite(
            @PathVariable(value = "activiteId") Long activiteId) {
        return ResponseEntity.ok(rapportService.genererRapportActivite(activiteId));
    }

    @GetMapping("/dons/{donId}")
    public ResponseEntity<responseRapport> genererRapportDon(
            @PathVariable(value = "donId") Long donId) {
        return ResponseEntity.ok(rapportService.genererRapportDon(donId));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<responseRapport>> getRapportsByType(
            @RequestParam(name = "type", required = true) String type) {
        return ResponseEntity.ok(rapportService.getRapportsByType(type));
    }

    @GetMapping("/date")
    public ResponseEntity<List<responseRapport>> getRapportsByDateBetween(
            @RequestParam(name = "dateDebut", required = true) String dateDebut,
            @RequestParam(name = "dateFin", required = true) String dateFin) {
        return ResponseEntity.ok(rapportService.getRapportsByDateBetween(dateDebut, dateFin));
    }
}
