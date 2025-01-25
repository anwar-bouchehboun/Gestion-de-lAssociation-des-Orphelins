package com.gestion.orphelins.controller;

import com.gestion.orphelins.dto.request.requestTuteur;
import com.gestion.orphelins.dto.response.responseDon;
import com.gestion.orphelins.dto.response.responseTuteur;
import com.gestion.orphelins.services.interfaces.TuteurInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/tuteur")
@RequiredArgsConstructor
public class TuteurController {
    private final TuteurInterface tuteurInterface;

    @PostMapping
    public ResponseEntity<Map<String, Object>> createTuteur(@Valid @RequestBody requestTuteur request) {
        responseTuteur response = tuteurInterface.createTuteur(request);
        Map<String, Object> responseMap = new HashMap<>();
        responseMap.put("status", "success");
        responseMap.put("message", "Tuteur créé avec succès");
        responseMap.put("data", response);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseMap);
    }

    @PostMapping("/multiple")
    public ResponseEntity<List<responseTuteur>> createMultipleTuteurs(@RequestBody List<requestTuteur> requests) {
        List<responseTuteur> responses = tuteurInterface.createMultipleTuteurs(requests);
        return ResponseEntity.status(HttpStatus.CREATED).body(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<responseTuteur> getTuteurById(@Valid @PathVariable Long id) {
        responseTuteur response = tuteurInterface.getTuteurById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<responseTuteur>> getAllTuteurs() {
        List<responseTuteur> response = tuteurInterface.getAllTuteurs();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search") // Maps HTTP GET requests to the /api/tuteur/search path.
    public ResponseEntity<responseTuteur> getByNomTuteur(@RequestParam String nomTuteur) {
        responseTuteur response = tuteurInterface.getTuteurByNom(nomTuteur);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/page")
    public ResponseEntity<Page<responseTuteur>> getAllTuteursPaginated(Pageable pageable) {
        Page<responseTuteur> response = tuteurInterface.getAllTuteursPaginated(pageable);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateTuteur(
            @Valid @PathVariable Long id,
            @Valid @RequestBody requestTuteur request) {
        responseTuteur response = tuteurInterface.updateTuteur(id, request);
        Map<String, Object> responseMap = new HashMap<>();
        responseMap.put("status", "success");
        responseMap.put("message", "Tuteur mis à jour avec succès");
        responseMap.put("data", response);
        return ResponseEntity.ok(responseMap);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteTuteur(
            @Valid @PathVariable Long id) {
        tuteurInterface.deleteTuteur(id);
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Tuteur supprimé avec succès");
        return ResponseEntity.ok(response);
    }
}
