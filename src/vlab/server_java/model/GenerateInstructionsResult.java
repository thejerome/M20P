package vlab.server_java.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;
import java.util.Objects;

import static vlab.server_java.model.util.HtmlParamEscaper.shrink;

public class GenerateInstructionsResult {
    private final BigDecimal[] q;
    private final BigDecimal[] q_hatch;
    private final BigDecimal[] q_2hatch;

    @JsonCreator
    public GenerateInstructionsResult(
            @JsonProperty("q") BigDecimal[] q,
            @JsonProperty("q_hatch") BigDecimal[] q_hatch,
            @JsonProperty("q_2hatch") BigDecimal[] q_2hatch) {
        Objects.requireNonNull(q);
        Objects.requireNonNull(q_hatch);
        Objects.requireNonNull(q_2hatch);
        if (q.length != 4){
            throw new IllegalArgumentException("q should have 4 elements but there was " + q.length);
        }
        if (q_hatch.length != 4){
            throw new IllegalArgumentException("q_hatch should have 4 elements but there was " + q_hatch.length);
        }
        if (q_2hatch.length != 4){
            throw new IllegalArgumentException("q_2hatch should have 4 elements but there was " + q_2hatch.length);
        }
        this.q = q;
        this.q[0] = shrink(q[0]);
        this.q[1] = shrink(q[1]);
        this.q[2] = shrink(q[2]);
        this.q[3] = shrink(q[3]);
        this.q_hatch = q_hatch;
        this.q_hatch[0] = shrink(q_hatch[0]);
        this.q_hatch[1] = shrink(q_hatch[1]);
        this.q_hatch[2] = shrink(q_hatch[2]);
        this.q_hatch[3] = shrink(q_hatch[3]);
        this.q_2hatch = q_2hatch;
        this.q_2hatch[0] = shrink(q_2hatch[0]);
        this.q_2hatch[1] = shrink(q_2hatch[1]);
        this.q_2hatch[2] = shrink(q_2hatch[2]);
        this.q_2hatch[3] = shrink(q_2hatch[3]);
    }

    @JsonProperty("q")
    public BigDecimal[] getQ() {
        return q;
    }

    @JsonProperty("q_hatch")
    public BigDecimal[] getQHatch() {
        return q_hatch;
    }

    @JsonProperty("q_2hatch")
    public BigDecimal[] getQ2Hatch() {
        return q_2hatch;
    }
}
