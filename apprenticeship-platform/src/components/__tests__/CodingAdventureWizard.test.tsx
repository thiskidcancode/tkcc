// Tests for CodingAdventureWizard.tsx
// Testing step-based wizard component for onboarding

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import CodingAdventureWizard from '../CodingAdventureWizard';

// lucide-react will be automatically mocked by Jest from __mocks__ directory

describe('CodingAdventureWizard', () => {
  it('should render the wizard with initial state', () => {
    render(<CodingAdventureWizard />);
    
    expect(screen.getByText(/Welcome Future Coder!/i)).toBeInTheDocument();
    expect(screen.getByText(/Device Detective Mission/i)).toBeInTheDocument();
  });

  describe('Step 1: Device Detective', () => {
    it('should allow user to select a device type', async () => {
      const user = userEvent.setup();
      render(<CodingAdventureWizard />);

      const laptopButton = screen.getByText(/Laptop\/Desktop/i).closest('button');
      expect(laptopButton).toBeInTheDocument();

      await user.click(laptopButton!);

      expect(screen.getByText(/Perfect! You have a Laptop\/Desktop/i)).toBeInTheDocument();
    });

    it('should show next button after device selection', async () => {
      const user = userEvent.setup();
      render(<CodingAdventureWizard />);

      const phoneButton = screen.getByText(/Phone\/Tablet/i).closest('button');
      await user.click(phoneButton!);

      const nextButton = screen.getByText(/Next: Become a Superhero!/i);
      expect(nextButton).toBeInTheDocument();
    });

    it('should navigate to next step when next button clicked', async () => {
      const user = userEvent.setup();
      render(<CodingAdventureWizard />);

      // Select device
      const chromebookButton = screen.getByText(/Chromebook/i).closest('button');
      await user.click(chromebookButton!);

      // Click next
      const nextButton = screen.getByText(/Next: Become a Superhero!/i);
      await user.click(nextButton);

      // Verify step 2 is shown
      await waitFor(() => {
        expect(screen.getByText(/Become a GitHub Superhero/i)).toBeInTheDocument();
      });
    });
  });

  describe('Step 2: GitHub Hero', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(<CodingAdventureWizard />);
      
      // Navigate to step 2
      const laptopButton = screen.getByText(/Laptop\/Desktop/i).closest('button');
      await user.click(laptopButton!);
      const nextButton = screen.getByText(/Next: Become a Superhero!/i);
      await user.click(nextButton);
    });

    it('should display GitHub step content', async () => {
      await waitFor(() => {
        expect(screen.getByText(/Become a GitHub Superhero/i)).toBeInTheDocument();
        expect(screen.getByText(/GitHub is like a secret base/i)).toBeInTheDocument();
      });
    });

    it('should accept user name and email inputs', async () => {
      const user = userEvent.setup();
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Your awesome name/i)).toBeInTheDocument();
      });

      const nameInput = screen.getByPlaceholderText(/Your awesome name/i);
      const emailInput = screen.getByPlaceholderText(/parent@email.com/i);

      await user.type(nameInput, 'Alex');
      await user.type(emailInput, 'parent@example.com');

      expect(nameInput).toHaveValue('Alex');
      expect(emailInput).toHaveValue('parent@example.com');
    });

    it('should show next button only after name and email are filled', async () => {
      const user = userEvent.setup();
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Your awesome name/i)).toBeInTheDocument();
      });

      // Next button should not be visible initially
      expect(screen.queryByText(/I Created My Account!/i)).not.toBeInTheDocument();

      const nameInput = screen.getByPlaceholderText(/Your awesome name/i);
      const emailInput = screen.getByPlaceholderText(/parent@email.com/i);

      await user.type(nameInput, 'Alex');
      await user.type(emailInput, 'parent@example.com');

      // Now next button should be visible
      expect(screen.getByText(/I Created My Account!/i)).toBeInTheDocument();
    });

    it('should toggle demo video visibility', async () => {
      const user = userEvent.setup();
      
      await waitFor(() => {
        expect(screen.getByText(/Show Me How/i)).toBeInTheDocument();
      });

      const demoButton = screen.getByText(/Show Me How/i);
      await user.click(demoButton);

      expect(screen.getByText(/Video: "A kid just like you/i)).toBeInTheDocument();
      expect(screen.getByText(/Hide Demo/i)).toBeInTheDocument();
    });
  });

  describe('Step 3: Coding Spaceship', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(<CodingAdventureWizard />);
      
      // Navigate through first two steps
      const laptopButton = screen.getByText(/Laptop\/Desktop/i).closest('button');
      await user.click(laptopButton!);
      await user.click(screen.getByText(/Next: Become a Superhero!/i));

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Your awesome name/i)).toBeInTheDocument();
      });

      const nameInput = screen.getByPlaceholderText(/Your awesome name/i);
      const emailInput = screen.getByPlaceholderText(/parent@email.com/i);
      await user.type(nameInput, 'Alex');
      await user.type(emailInput, 'parent@example.com');
      await user.click(screen.getByText(/I Created My Account!/i));
    });

    it('should display coding spaceship step', async () => {
      await waitFor(() => {
        expect(screen.getByText(/Enter Your Coding Spaceship/i)).toBeInTheDocument();
      });
    });

    it('should show launch button', async () => {
      await waitFor(() => {
        expect(screen.getByText(/Launch My Spaceship!/i)).toBeInTheDocument();
      });
    });

    it('should show confirmation after launching', async () => {
      const user = userEvent.setup();
      
      await waitFor(() => {
        expect(screen.getByText(/Launch My Spaceship!/i)).toBeInTheDocument();
      });

      const launchButton = screen.getByText(/Launch My Spaceship!/i);
      await user.click(launchButton);

      expect(screen.getByText(/Spaceship Launched!/i)).toBeInTheDocument();
      expect(screen.getByText(/My Spaceship is Ready!/i)).toBeInTheDocument();
    });
  });

  describe('State Management', () => {
    it('should maintain state across step transitions', async () => {
      const user = userEvent.setup();
      render(<CodingAdventureWizard />);

      // Select device in step 1
      const laptopButton = screen.getByText(/Laptop\/Desktop/i).closest('button');
      await user.click(laptopButton!);
      await user.click(screen.getByText(/Next: Become a Superhero!/i));

      // Enter name in step 2
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Your awesome name/i)).toBeInTheDocument();
      });
      
      const nameInput = screen.getByPlaceholderText(/Your awesome name/i);
      await user.type(nameInput, 'TestUser');
      
      // State should be maintained
      expect(nameInput).toHaveValue('TestUser');
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(<CodingAdventureWizard />);
      
      const mainHeading = screen.getByText(/Welcome Future Coder!/i);
      expect(mainHeading.tagName).toBe('H1');
    });

    it('should have descriptive button text', () => {
      render(<CodingAdventureWizard />);
      
      // Check that buttons have clear, descriptive text
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button.textContent).toBeTruthy();
      });
    });
  });
});
