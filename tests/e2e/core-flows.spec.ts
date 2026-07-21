import { expect, test } from "@playwright/test";

test("a visitor can move from the homepage to pricing", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /One client\. Every advantage\./i }),
  ).toBeVisible();
  await page.getByRole("link", { name: "View pricing" }).click();

  await expect(page).toHaveURL(/\/pricing$/);
  await expect(
    page.getByRole("heading", { name: "One license. Everything unlocked." }),
  ).toBeVisible();
  await expect(page.getByText("1 Year", { exact: true })).toBeVisible();
});

test("the login form reports missing credentials without a network request", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Log in" }).click();

  await expect(page.getByText("Enter your email address.")).toBeVisible();
  await expect(page.getByText("Enter your password.")).toBeVisible();
});

test("an unauthenticated visitor cannot open account billing", async ({ page }) => {
  await page.goto("/account/billing");

  await expect(page).toHaveURL(/\/login$/);
  await expect(
    page.getByRole("heading", { name: "Welcome back" }),
  ).toBeVisible();
});
