package vlab.server_java.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;
import java.util.Objects;

import static vlab.server_java.model.util.HtmlParamEscaper.shrink;

public class GenerateCodeResult {

    private final BigDecimal mass_1;
    private final BigDecimal mass_2;
    private final BigDecimal mass_3;
    private final BigDecimal mass_4;
    private final BigDecimal time;

    @JsonCreator
    public GenerateCodeResult(
            @JsonProperty("mass_1") BigDecimal mass_1,
            @JsonProperty("mass_2") BigDecimal mass_2,
            @JsonProperty("mass_3") BigDecimal mass_3,
            @JsonProperty("mass_4") BigDecimal mass_4,
            @JsonProperty("time") BigDecimal time) {
        Objects.requireNonNull(mass_1);
        Objects.requireNonNull(mass_2);
        Objects.requireNonNull(mass_3);
        Objects.requireNonNull(mass_4);
        Objects.requireNonNull(time);

        this.mass_1 = shrink(mass_1);
        this.mass_2 = shrink(mass_2);
        this.mass_3 = shrink(mass_3);
        this.mass_4 = shrink(mass_4);
        this.time = shrink(time);
    }

    public BigDecimal getMass_1() {
        return mass_1;
    }

    public BigDecimal getMass_2() {
        return mass_2;
    }

    public BigDecimal getMass_3() {
        return mass_3;
    }

    public BigDecimal getMass_4() {
        return mass_4;
    }

    public BigDecimal getTime() {
        return time;
    }
}
