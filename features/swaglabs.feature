Feature: Swag Labs end-to-end shopping journey

  As a user
  I want to interact with the Swag Labs application
  So that I can validate login, product sorting, cart, checkout and logout functionality

  Scenario: Login using a valid user
    Given I am on the Swag Labs login page
    When I login with username "standard_user" and password "secret_sauce"
    Then the Products page should be displayed

  Scenario Outline: Login using invalid users
    Given I am on the Swag Labs login page
    When I login with username "<username>" and password "<password>"
    Then a login error message should be displayed

    Examples:
      | username        | password         |
      | invalid_user    | secret_sauce     |
      | standard_user   | invalid_password |
      | invalid_user    | invalid_password |

  Scenario Outline: Sort and validate products by all available sorting options
    Given I am logged into Swag Labs
    When I sort the products by "<sortOption>"
    Then the products should be correctly sorted by "<sortOption>"

    Examples:
      | sortOption          |
      | Name (A to Z)       |
      | Name (Z to A)       |
      | Price (low to high) |
      | Price (high to low) |

  Scenario: Add all products to cart and validate cart count
    Given I am logged into Swag Labs
    When I add all products to the cart
    Then the cart badge should display the correct product count

  Scenario: Validate cart total before checkout
    Given I am logged into Swag Labs
    And I have added all products to the cart
    When I open the shopping cart
    Then the calculated cart total should match the sum of all product prices

  Scenario: Complete checkout with valid information
    Given I am logged into Swag Labs
    And I have added all products to the cart
    And I proceed to checkout
    When I enter valid checkout information
    Then I should proceed to the checkout overview page

  Scenario Outline: Checkout with missing required information
    Given I am logged into Swag Labs
    And I have added all products to the cart
    And I proceed to checkout
    When I enter first name "<firstName>", last name "<lastName>" and postal code "<postalCode>"
    Then a checkout error message should be displayed

    Examples:
      | firstName | lastName  | postalCode |
      |           | Breakfast | 8000       |
      | Yolanda   |           | 8000       |
      | Yolanda   | Breakfast |            |

  Scenario: Validate checkout totals and tax
    Given I am logged into Swag Labs
    And I have added all products to the cart
    And I proceed to checkout
    And I enter valid checkout information
    Then the displayed item total should match the calculated product total
    And tax should be displayed

  Scenario: Complete purchase and validate post-checkout journey
    Given I am logged into Swag Labs
    And I have added all products to the cart
    And I proceed to checkout
    And I enter valid checkout information
    When I complete the checkout
    Then the checkout should complete successfully
    And the success title should be displayed
    And the success description should be displayed
    And the cart badge should not display a number
    When I open the burger menu
    And I navigate to All Items
    Then the Products page should be displayed
    And the cart should be empty
    When I logout
    Then the Login page should be displayed