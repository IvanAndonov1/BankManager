package com.bank.service;

import com.bank.dto.EvaluationBreakdown;
import org.springframework.stereotype.Service;

@Service
public class CreditFeedbackAiService {

    private final Ollama ollama;

    public CreditFeedbackAiService(Ollama ollama) {
        this.ollama = ollama;
    }

    public String generateAiFeedback(EvaluationBreakdown breakdown) {
        String prompt = """
    You are a bank loan advisor. Interpret the following scores.

    RULES:
    - Scores are 0–100. Higher = better. 100 = excellent, 0 = very poor.
    - Interpret each score as:
      • 0–40 → Poor
      • 41–70 → Fair
      • 71–100 → Strong
    - Write one short sentence per score.
    - End with a brief overall assessment (2–3 sentences).
    
    User this as a reference and change it according to the actual scores:
    - Tenure: Strong — the applicant has a very stable work history. 
    - DTI: Strong — debt-to-income ratio is excellent. 
    - Account Age: Poor — credit history is still short. 
    - Cushion: Poor — no savings or financial buffer. 
    - Recent Debt: Strong — no risky recent borrowing. 
    
     Write no more than 70 words. If you exceed, your answer will be cut.
                
                
    Overall: The applicant demonstrates strong DTI, tenure, and recent debt behavior. However, the lack of savings and short account history weaken the profile. Recommendation: CONSIDER.
    Applicant:
    - Tenure: %d
    - Debt-to-Income (DTI): %d
    - Account Age: %d
    - Cushion: %d
    - Recent Debt: %d
    Composite: %d/%d (%.1f%%)
    Recommendation: %s
    """.formatted(
                breakdown.tenureScore(),
                breakdown.dtiScore(),
                breakdown.accountAgeScore(),
                breakdown.cushionScore(),
                breakdown.recentDebtScore(),
                breakdown.accumulatedPoints(),
                breakdown.maxPossiblePoints(),
                breakdown.percentageOfMax(),
                breakdown.recommendation()
        );

        String raw = ollama.generate("llama3.2:3b", prompt);
        return raw.replace("\n", " ");

    }
}

