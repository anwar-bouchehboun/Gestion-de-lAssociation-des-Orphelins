package com.gestion.orphelins.controller;

import com.gestion.orphelins.services.interfaces.OrphelinInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.gestion.orphelins.dto.request.requestOrphelin;
import com.gestion.orphelins.dto.response.responseOrphelin;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.security.access.prepost.PreAuthorize;
import javax.validation.Valid;

@RestController // Marks this class as a RESTful controller.
@RequestMapping("/api/orphlines") // Maps all HTTP requests to this controller to the /api/orphlines path.
@RequiredArgsConstructor
public class OrphelinsController {

    private final OrphelinInterface orphelinInterface;

    @PostMapping // Maps HTTP POST requests to the /api/orphelins path.
    @PreAuthorize("hasAnyRole('GESTIONNAIRE', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> createOrphelin(
            @Valid @RequestBody requestOrphelin request) {
        responseOrphelin response = orphelinInterface.createOrphelin(request);
        Map<String, Object> responseMap = new HashMap<>();
        responseMap.put("status", "success");
        responseMap.put("message", "Orphelin créé avec succès");
        responseMap.put("data", response);
        return ResponseEntity.ok(responseMap);
    }

    @GetMapping // Maps HTTP GET requests to the /api/orphelins path.
    @PreAuthorize("hasAnyRole('GESTIONNAIRE','ADMIN','COLLABORATEUR')")
    public ResponseEntity<?> getAllOrphelins() {
        List<responseOrphelin> response = orphelinInterface.getAllOrphelins();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/page") // Maps HTTP GET requests to the /api/orphelins/page path.
    @PreAuthorize("hasAnyRole('GESTIONNAIRE','ADMIN','COLLABORATEUR')")
    public ResponseEntity<Page<responseOrphelin>> getAllOrphelinsPaginated(Pageable pageable) {
        return ResponseEntity.ok(orphelinInterface.getAllOrphelinsPaginated(pageable));
    }

    @GetMapping("/{id}") // Maps HTTP GET requests to the /api/orphelins/{id} path.
    @PreAuthorize("hasAnyRole('GESTIONNAIRE','ADMIN','COLLABORATEUR')")
    public ResponseEntity<?> getOrphelinById(
            @Valid @PathVariable Long id) {
        responseOrphelin response = orphelinInterface.getOrphelinById(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}") // Maps HTTP PUT requests to the /api/orphelins/{id} path.
    @PreAuthorize("hasAnyRole('GESTIONNAIRE', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> updateOrphelin(
            @Valid @PathVariable Long id,
            @Valid @RequestBody requestOrphelin request) {
        responseOrphelin response = orphelinInterface.updateOrphelin(id, request);
        Map<String, Object> responseMap = new HashMap<>();
        responseMap.put("status", "success");
        responseMap.put("message", "Orphelin mis à jour avec succès");
        responseMap.put("data", response);
        return ResponseEntity.ok(responseMap);
    }

    @DeleteMapping("/{id}") // Maps HTTP DELETE requests to the /api/orphelins/{id} path.
    @PreAuthorize("hasAnyRole('GESTIONNAIRE', 'ADMIN')")
    public ResponseEntity<Map<String, String>> deleteOrphelin(@Valid @PathVariable Long id) {
        orphelinInterface.deleteOrphelin(id);
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Orphelin supprimé avec succès");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/create-all") // Maps HTTP POST requests to the /api/orphelins/create-all path.
    @PreAuthorize("hasAnyRole('GESTIONNAIRE', 'ADMIN')")
    public ResponseEntity<List<responseOrphelin>> saveAllOrphelins(
            @Valid @RequestBody List<requestOrphelin> requests) {
        return ResponseEntity.ok(orphelinInterface.saveAllOrphelins(requests));
    }

  
    @GetMapping("/search") // Maps HTTP GET requests to the /api/orphelins/search path.
    @PreAuthorize("hasAnyRole('GESTIONNAIRE','ADMIN','COLLABORATEUR')")
    public ResponseEntity<List<responseOrphelin>> getByNomOrphelin(@RequestParam String nomOrphelin) {
        List<responseOrphelin> response = orphelinInterface.getAllOrphelinsByNom(nomOrphelin);
        return ResponseEntity.ok(response);
    }

}
