import * as playwright from 'playwright-core';
export class DetailsPage {
  private readonly detailsTableSelector='div.model-version__details'
  private readonly rowsSelector='ol.model-version__details_list'
  private readonly statusSelector='hs-model-version-status.model-version__details-status-icon'
  private readonly showBuildLogsButtonSelector='button.model-version__details-status-button.hs-button.hs-button--base.hs-button--base-base.ng-star-inserted'
  private readonly monitoringButtonSelector='button.hs-button.hs-button--flat.hs-button--flat-primary'
  private readonly createApplicationButtonSelector='button.model-version__item-button.create-application-button.hs-button.hs-button--flat-primary'
  private readonly applicationsTableSelector='div.model-version__applications'
  private readonly applicationsRowsSelector='div.model-version__applications-empty.ng-star-inserted'
  private readonly applicationsHeaderSelector='thead.hydro-table-head'
  private readonly servablesTableSelector='section.model-version__servables.ng-star-inserted'
  private readonly servablesHeaderSelector='thead.hydro-table-head'
  private readonly servablesRowsSelector='thead.hydro-table-body'
  private readonly servablesEmptySelector='div.servables--is-empty.ng-star-inserted'
  private readonly signaturesTableSelector='section.model-version__signatures'
  private readonly signaturesHeaderSelector='tr.fields-table__row.fields-table__row--labels'
  private readonly signaturesRowsSelector='tr.fields-table__row.ng-star-inserted'
  private readonly metadataTableSelector='section.model-version__metadata'
  private readonly metadataRowsSelector='table.metadata__table.ng-star-inserted'











}
