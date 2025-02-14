package com.gestion.orphelins.controller;

import com.gestion.orphelins.services.interfaces.ActiviteInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.gestion.orphelins.dto.request.requestActivite;
import com.gestion.orphelins.dto.response.responseActivite;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/activites")
@RequiredArgsConstructor
public class ActiviteController {

    private final ActiviteInterface activiteInterface;

    @PostMapping // create activite
    @PreAuthorize("hasRole('GESTIONNAIRE')")
    public ResponseEntity<Map<String, Object>> createActivite(@Valid @RequestBody requestActivite request) {
        responseActivite response = activiteInterface.createActivite(request);
        Map<String, Object> responseMap = new HashMap<>();
        responseMap.put("status", "success");
        responseMap.put("message", "Activité créée avec succès");
        responseMap.put("data", response);
        return ResponseEntity.ok(responseMap);
    }

    @GetMapping // get all activites
    @PreAuthorize("hasAnyRole('GESTIONNAIRE', 'ADMIN','COLLABORATEUR')")
    public ResponseEntity<Map<String, Object>> getAllActivites() {
        List<responseActivite> response = activiteInterface.getAllActivites();
        Map<String, Object> responseMap = new HashMap<>();
        responseMap.put("status", "success");
        responseMap.put("message", "Liste des activités récupérée avec succès");
        responseMap.put("data", response);
        return ResponseEntity.ok(responseMap);
    }

    @GetMapping("/page") // get all activites paginated
    @PreAuthorize("hasAnyRole('GESTIONNAIRE', 'ADMIN','COLLABORATEUR')")
    public ResponseEntity<Page<responseActivite>> getAllActivitesPaginated(Pageable pageable) {
        return ResponseEntity.ok(activiteInterface.getAllActivitesPaginated(pageable));
    }

    @GetMapping("/{id}") // get activite by id
    @PreAuthorize("hasRole('GESTIONNAIRE')")
    public ResponseEntity<Map<String, Object>> getActiviteById(@Valid @PathVariable Long id) {
        responseActivite response = activiteInterface.getActiviteById(id);
        Map<String, Object> responseMap = new HashMap<>();
        responseMap.put("status", "success");
        responseMap.put("message", "Activité trouvée avec succès");
        responseMap.put("data", response);
        return ResponseEntity.ok(responseMap);
    }

    @PutMapping("/{id}") // update activite
    @PreAuthorize("hasRole('GESTIONNAIRE')")
    public ResponseEntity<Map<String, Object>> updateActivite(
            @Valid @PathVariable Long id,
            @Valid @RequestBody requestActivite request) {
        responseActivite response = activiteInterface.updateActivite(id, request);
        Map<String, Object> responseMap = new HashMap<>();
        responseMap.put("status", "success");
        responseMap.put("message", "Activité mise à jour avec succès");
        responseMap.put("data", response);
        return ResponseEntity.ok(responseMap);
    }

    @DeleteMapping("/{id}") // delete activite
    @PreAuthorize("hasRole('GESTIONNAIRE')")
    public ResponseEntity<Map<String, String>> deleteActivite(@Valid @PathVariable Long id) {
        activiteInterface.deleteActivite(id);
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Activité supprimée avec succès");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/create-all") // create all activites
    @PreAuthorize("hasRole('GESTIONNAIRE')")
    public ResponseEntity<Map<String, Object>> saveAllActivites(@Valid @RequestBody List<requestActivite> requests) {
        List<responseActivite> response = activiteInterface.saveAllActivites(requests);
        Map<String, Object> responseMap = new HashMap<>();
        responseMap.put("status", "success");
        responseMap.put("message", "Activités créées avec succès");
        responseMap.put("data", response);
        return ResponseEntity.ok(responseMap);
    }

    @GetMapping("/search") // search activites by nom
    @PreAuthorize("hasAnyRole('GESTIONNAIRE', 'ADMIN','COLLABORATEUR')")
    public ResponseEntity<Map<String, Object>> searchActivites(@RequestParam String nom) {
        List<responseActivite> response = activiteInterface.getAllActivitesByNom(nom);
        Map<String, Object> responseMap = new HashMap<>();
        responseMap.put("status", "success");
        responseMap.put("message", "Recherche effectuée avec succès");
        responseMap.put("data", response);
        return ResponseEntity.ok(responseMap);
    }

    @GetMapping("/nom") // get activite by nom
    @PreAuthorize("hasAnyRole('GESTIONNAIRE', 'ADMIN','COLLABORATEUR')")
    public ResponseEntity<Map<String, Object>> getActiviteByNom(@RequestParam String nom) {
        responseActivite response = activiteInterface.getActiviteByNom(nom);
        Map<String, Object> responseMap = new HashMap<>();
        responseMap.put("status", "success");
        responseMap.put("message", "Activité trouvée avec succès");
        responseMap.put("data", response);
        return ResponseEntity.ok(responseMap);
    }
}
