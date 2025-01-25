package com.gestion.orphelins.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
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
    public ResponseEntity<responseDon> createDon(@Valid @RequestBody requestDon request) {
        responseDon response = donInterface.createDon(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
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
    public ResponseEntity<responseDon> updateDon(@Valid @PathVariable Long id, @RequestBody requestDon request) {
        responseDon response = donInterface.updateDon(id, request);
        return ResponseEntity.ok(response);
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
