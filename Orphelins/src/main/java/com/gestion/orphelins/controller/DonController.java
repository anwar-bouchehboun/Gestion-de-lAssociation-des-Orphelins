package com.gestion.orphelins.controller;

import lombok.RequiredArgsConstructor;
import com.gestion.orphelins.services.interfaces.DonInterface;
import com.gestion.orphelins.dto.request.requestDon;
import com.gestion.orphelins.dto.response.responseDon;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.time.LocalDate;

import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import javax.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController // Marks this class as a RESTful controller.
@RequestMapping("/api/don") // Maps all HTTP requests to this controller to the /api/don path.
@RequiredArgsConstructor // Automatically generates a constructor for this class with final fields as
                         // parameters.
public class DonController {
    private final DonInterface donInterface;

    @PostMapping // Maps HTTP POST requests to the /api/don path.
    @PreAuthorize("hasRole('GESTIONNAIRE')")
    public ResponseEntity<Map<String, String>> createDon(@Valid @RequestBody requestDon request) {
        donInterface.createDon(request);
        Map<String, String> responseMap = new HashMap<>();
        responseMap.put("status", "success");
        responseMap.put("message", "Don créé avec succès");
        return ResponseEntity.status(HttpStatus.CREATED).body(responseMap);
    }
    @PutMapping("/{id}") // Maps HTTP PUT requests to the /api/don/{id} path.
    @PreAuthorize("hasRole('GESTIONNAIRE')")
    public ResponseEntity<Map<String, String>> updateDon(@Valid @PathVariable Long id,
                                                         @RequestBody requestDon request) {
        donInterface.updateDon(id, request);
        Map<String, String> responseMap = new HashMap<>();
        responseMap.put("status", "success");
        responseMap.put("message", "Don mis à jour avec succès");
        return ResponseEntity.ok(responseMap);
    }


    @GetMapping("/{id}") // Maps HTTP GET requests to the /api/don/{id} path.
    @PreAuthorize("hasRole('GESTIONNAIRE')")
    public ResponseEntity<responseDon> getDonById(@Valid @PathVariable Long id) {
        responseDon response = donInterface.getDonById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/nomDonateur/{nomDonateur}") // Maps HTTP GET requests to the /api/don/nomDonateur/{nomDonateur} path.
    @PreAuthorize("hasAnyRole('GESTIONNAIRE', 'ADMIN')")
    public ResponseEntity<responseDon> getDonByNomDonateur(@Valid @PathVariable String nomDonateur) {
        responseDon response = donInterface.getDonByNomDonateur(nomDonateur);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search") // Maps HTTP GET requests to the /api/don/search path.
    @PreAuthorize("hasAnyRole('GESTIONNAIRE', 'ADMIN')")
    public ResponseEntity<responseDon> getByNomDonateur(@RequestParam String nomDonateur) {
        responseDon response = donInterface.getDonByNomDonateur(nomDonateur);
        return ResponseEntity.ok(response);
    }

    @GetMapping // Maps HTTP GET requests to the /api/don path.
    @PreAuthorize("hasAnyRole('GESTIONNAIRE', 'ADMIN')")
    public ResponseEntity<List<responseDon>> getAllDons() {
        List<responseDon> response = donInterface.getAllDons();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/page") // Maps HTTP GET requests to the /api/don/page path.
    @PreAuthorize("hasAnyRole('GESTIONNAIRE', 'ADMIN')")
    public ResponseEntity<Page<responseDon>> getAllDonsPaginated(Pageable pageable) {
        Page<responseDon> response = donInterface.getAllDonsPaginated(pageable);
        return ResponseEntity.ok(response);
    }


    @DeleteMapping("/{id}") // Maps HTTP DELETE requests to the /api/don/{id} path.
    @PreAuthorize("hasRole('GESTIONNAIRE')")
    public ResponseEntity<Map<String, String>> deleteDon(@Valid @PathVariable Long id) {
        donInterface.deleteDon(id);
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Don supprimé avec succès");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/between")
    @PreAuthorize("hasAnyRole('GESTIONNAIRE', 'ADMIN')")
    public ResponseEntity<List<responseDon>> getDonsBetweenDates(
            @RequestParam LocalDate dateDebut,
            @RequestParam LocalDate dateFin) {
        List<responseDon> response = donInterface.findByDateCreationBetween(dateDebut, dateFin);
        return ResponseEntity.ok(response);
    }
}
