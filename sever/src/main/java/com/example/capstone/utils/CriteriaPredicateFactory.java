package com.example.capstone.utils;

import java.util.function.Function;
import java.util.function.Predicate;

import com.example.capstone.entities.Committee;
import com.example.capstone.entities.Criteria;
import com.example.capstone.entities.User;

public class CriteriaPredicateFactory {
	private static void validate( ExpressionParser parser, String... expected ) {
		for( int i = 0; i < expected.length; i++ ) {
			if( !parser.peek( i ).equals( expected[i] ) ) throw new IllegalArgumentException(); 
		}
	}
	
	private static void consume(ExpressionParser parser, String... expected  ) {
		for( int i = 0; i < expected.length; i++ ) {
			if( !parser.peek( i ).equals( expected[i] ) ) throw new IllegalArgumentException(); 
		}
		
		parser.advance( expected.length );
	}

	// (all tenured)
	// (all full-time)
	// (all grad-status)
	public static Predicate<Committee> all( ExpressionParser parser ) {
		consume( parser, "(", "all" );

		String property = parser.nextToken();
		Function<User, Boolean> getter;
		switch( property ) {
			case "tenured" : getter = User::getTenured; break;
			case "grad-status" : getter = User::getGradStatus; break;
			default: throw new IllegalArgumentException();
		}
		
		consume( parser, ")" );
		return (committee) -> committee.getMembers().stream().allMatch( u -> getter.apply(u) );
	}
	
		
	// (college cls 3)
	// (college csh 3) 
	// (college cba 1)
	public static Predicate<Committee> college( ExpressionParser parser ) {
		consume( parser, "(", "college" );
		String college = parser.nextToken();
		Integer count = Integer.parseInt( parser.nextToken() );
		Predicate<User> userCheck = u -> u.getCollege() != null && u.getCollege().toLowerCase().equals( college );
		consume( parser, ")");
	
		return committee -> 
		committee
			.getMembers()
			.stream()
				.filter( userCheck )
				.count() >= count;
	}
	// (soe 1)
	public static Predicate<Committee> soe( ExpressionParser parser ) {
		consume( parser, "(", "soe" );
		Integer count = Integer.parseInt( parser.nextToken() );
		Predicate<User> userCheck = User::getSoe;
		consume( parser, ")");

		return committee -> 
		committee
			.getMembers()
			.stream()
				.filter( userCheck )
				.count() >= count;
	}

	// (size 9)
	public static Predicate<Committee> sizeOf( ExpressionParser parser ) {
		consume( parser, "(", "size" );
		Integer size = Integer.parseInt( parser.nextToken() );
		consume( parser, ")" );
		
		return c -> c.getMembers().size() == size;
	}
	
	// always of the form (...)
	public static Predicate<Committee> expression( ExpressionParser parser ) {
		validate( parser, "(" );
		String type = parser.peek( 1 );

		Predicate<Committee> result = null;
		switch( type ) {
			case "all" : result = all( parser ); break;
			case "size" : result = sizeOf( parser ); break;
			case "college" : result = college( parser ); break;
			case "soe" : result = soe( parser); break;
			default: throw new IllegalArgumentException();
		}
		
		return result;					
	}


	public static Predicate<Committee> build(Criteria crit) {
		ExpressionParser parser = new ExpressionParser( crit.getCriteria().toLowerCase() );
		return expression( parser );
	}
}
