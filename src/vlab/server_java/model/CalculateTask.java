package vlab.server_java.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import vlab.server_java.model.util.HtmlParamEscaper;

import java.math.BigDecimal;
import java.util.Objects;

import static vlab.server_java.model.util.HtmlParamEscaper.shrink;

public class CalculateTask {
    private final BigDecimal S;

    @JsonCreator
    public CalculateTask(
            @JsonProperty("S") BigDecimal S) {
        Objects.requireNonNull(S);
        this.S = shrink(S);

    }

    @JsonProperty("S")
    public BigDecimal getS() {
        return S;
    }
}
