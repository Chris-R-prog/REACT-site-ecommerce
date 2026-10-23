function AddressFields({ prefix, register, errors }) {
  const fieldErrors = errors?.[prefix] ?? {};
  const addressType = prefix === "billingAddress" ? "billing" : "shipping";

  return (
    <div className="address-fields">
      <div className="checkout-field">
        <label htmlFor={`${prefix}-name`}>Nom et prénom</label>

        <input
          id={`${prefix}-name`}
          type="text"
          autoComplete={`${addressType} name`}
          aria-invalid={Boolean(fieldErrors.name)}
          aria-describedby={
            fieldErrors.name ? `${prefix}-name-error` : undefined
          }
          {...register(`${prefix}.name`)}
        />

        {fieldErrors.name && (
          <p id={`${prefix}-name-error`} className="field-error">
            {fieldErrors.name.message}
          </p>
        )}
      </div>

      <div className="checkout-field">
        <label htmlFor={`${prefix}-street`}>Adresse</label>

        <input
          id={`${prefix}-street`}
          type="text"
          autoComplete={`${addressType} street-address`}
          aria-invalid={Boolean(fieldErrors.street)}
          aria-describedby={
            fieldErrors.street ? `${prefix}-street-error` : undefined
          }
          {...register(`${prefix}.street`)}
        />

        {fieldErrors.street && (
          <p id={`${prefix}-street-error`} className="field-error">
            {fieldErrors.street.message}
          </p>
        )}
      </div>

      <div className="address-row">
        <div className="checkout-field">
          <label htmlFor={`${prefix}-postalCode`}>Code postal</label>

          <input
            id={`${prefix}-postalCode`}
            type="text"
            autoComplete={`${addressType} postal-code`}
            maxLength={12}
            aria-invalid={Boolean(fieldErrors.postalCode)}
            aria-describedby={
              fieldErrors.postalCode ? `${prefix}-postalCode-error` : undefined
            }
            {...register(`${prefix}.postalCode`)}
          />

          {fieldErrors.postalCode && (
            <p id={`${prefix}-postalCode-error`} className="field-error">
              {fieldErrors.postalCode.message}
            </p>
          )}
        </div>

        <div className="checkout-field">
          <label htmlFor={`${prefix}-city`}>Ville</label>

          <input
            id={`${prefix}-city`}
            type="text"
            autoComplete={`${addressType} address-level2`}
            aria-invalid={Boolean(fieldErrors.city)}
            aria-describedby={
              fieldErrors.city ? `${prefix}-city-error` : undefined
            }
            {...register(`${prefix}.city`)}
          />

          {fieldErrors.city && (
            <p id={`${prefix}-city-error`} className="field-error">
              {fieldErrors.city.message}
            </p>
          )}
        </div>
      </div>

      <div className="checkout-field">
        <label htmlFor={`${prefix}-country`}>Pays</label>

        <input
          id={`${prefix}-country`}
          type="text"
          autoComplete="country-name"
          aria-invalid={Boolean(fieldErrors.country)}
          aria-describedby={
            fieldErrors.country ? `${prefix}-country-error` : undefined
          }
          {...register(`${prefix}.country`)}
        />

        {fieldErrors.country && (
          <p id={`${prefix}-country-error`} className="field-error">
            {fieldErrors.country.message}
          </p>
        )}
      </div>
    </div>
  );
}

export default AddressFields;
