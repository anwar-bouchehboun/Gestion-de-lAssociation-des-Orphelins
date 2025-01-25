package com.gestion.orphelins.services.interfaces;

import com.gestion.orphelins.dto.request.requestDon;
import com.gestion.orphelins.dto.response.responseDon;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface DonInterface {
    responseDon createDon(requestDon request);

    responseDon getDonById(Long id);

    responseDon getDonByNomDonateur(String nomDonateur);

    List<responseDon> getAllDons();

    Page<responseDon> getAllDonsPaginated(Pageable pageable);

    responseDon updateDon(Long id, requestDon request);

    void deleteDon(Long id);
    
}
