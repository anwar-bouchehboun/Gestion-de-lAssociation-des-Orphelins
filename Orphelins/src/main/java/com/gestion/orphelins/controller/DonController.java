package com.gestion.orphelins.controller;

import lombok.RequiredArgsConstructor;
import com.gestion.orphelins.services.interfaces.DonInterface;
import com.gestion.orphelins.dto.request.requestDon;
import com.gestion.orphelins.dto.response.responseDon;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import javax.validation.Valid;

@RestController // Marks this class as a RESTful controller.
@RequestMapping("/api/don")
@RequiredArgsConstructor
public class DonController {
    private final DonInterface donInterface;

    @PostMapping
    public ResponseEntity<Map<String,String>> createDon(@Valid @RequestBody requestDon request) {
        donInterface.createDon(request);
        Map<String, String> responseMap = new HashMap<>();
        responseMap.put("status", "success");
        responseMap.put("message", "Don créé avec succès");
        return ResponseEntity.status(HttpStatus.CREATED).body(responseMap);
    }

    @GetMapping("/{id}")
    public ResponseEntity<responseDon> getDonById(@Valid @PathVariable Long id) {
        responseDon response = donInterface.getDonById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/nomDonateur/{nomDonateur}")
    public ResponseEntity<responseDon> getDonByNomDonateur(@Valid @PathVariable String nomDonateur) {
        responseDon response = donInterface.getDonByNomDonateur(nomDonateur);
        return ResponseEntity.ok(response);
    }
     @GetMapping("/search")
    public ResponseEntity<responseDon> getByNomDonateur(@RequestParam String nomDonateur) {
        responseDon response = donInterface.getDonByNomDonateur(nomDonateur);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<responseDon>> getAllDons() {
        List<responseDon> response = donInterface.getAllDons();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/page")
    public ResponseEntity<Page<responseDon>> getAllDonsPaginated(Pageable pageable) {
        Page<responseDon> response = donInterface.getAllDonsPaginated(pageable);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String,String>> updateDon(@Valid @PathVariable Long id, @RequestBody requestDon request) {
        donInterface.updateDon(id, request);
        Map<String, String> responseMap = new HashMap<>();
        responseMap.put("status", "success");
        responseMap.put("message", "Don mis à jour avec succès");
        return ResponseEntity.ok(responseMap);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteDon(@Valid @PathVariable Long id) {
        donInterface.deleteDon(id);
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Don supprimé avec succès");
        return ResponseEntity.ok(response);
    }
}
